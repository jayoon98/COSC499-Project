import { useState } from 'react';
import update from 'immutability-helper';
import ReactTooltip from 'react-tooltip';
import { FiCheckSquare } from 'react-icons/fi';
import { BiRadioCircleMarked } from 'react-icons/bi';
import { BsCardText } from 'react-icons/bs';
import { MdLinearScale } from 'react-icons/md';
import { GoListOrdered } from 'react-icons/go';
import Question from '../Question';
import Submit from '../Submit';
import * as Constants from '../../constants';

export default function Survey({ props }) {
  const { submit, submitMessage, admin } = props;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [fetchAttempted, setfetchAttempted] = useState(false);

  async function getQuestions() {
    await fetch('/api/getQuestions', {
      method: 'POST',
      body: JSON.stringify({
        getDisabled: admin,
      }),
    }).then((response) => response.json())
      .then((response) => {
        if (!response.error) {
          setfetchAttempted(true);
          setQuestions(response.questions);
          const temp = new Array(response.questions.length);
          for (let i = 0; i < temp.length; i += 1) {
            temp[i] = { qid: response.questions[i].qid, idx: i + 1 };
          }
          setAnswers(temp);
        }
      })
      .catch(() => {
        setfetchAttempted(true);
      });
  }

  function updateAnswer(i, answer) {
    if (answers.length === 0) return;
    const temp = JSON.parse(JSON.stringify(answers));
    temp[i] = { ...answers[i], answer };
    setAnswers(temp);
  }

  function updateQuestion(idx, data) {
    const temp = update(questions, { [idx]: { $set: data } });
    temp[idx].edit = true;
    if (temp[idx].extra) temp[idx].extra_sa = true;
    else temp[idx].extra_sa = false;

    // calculate new max_score and min_score for the question
    const tempSQ = JSON.parse(JSON.stringify(temp[idx].subquestions));
    switch (temp[idx].type) {
      case Constants.SA:
        // no scoring for short answers
        break;
      case Constants.MCR:
        // highest weighted option
        temp[idx].max_score = tempSQ.reduce(
          (a, x) => a + (x.weight === 1 ? 1 : 0), 0,
        );
        // lowest weighted option
        temp[idx].min_score = tempSQ.reduce(
          (a, x) => a + (x.weight === -1 ? -1 : 0), 0,
        );
        break;
      case Constants.MCC:
        // # of answers with a weight of 1
        temp[idx].max_score = tempSQ.reduce(
          (a, x) => a + (x.weight === 1 ? 1 : 0), 0,
        );
        // -1 * # of answers with a weight of -1
        temp[idx].min_score = tempSQ.reduce(
          (a, x) => a + (x.weight === -1 ? -1 : 0), 0,
        );
        break;
      case Constants.SCALE:
        // max value (scale)
        temp[idx].max_score = tempSQ[0].scale;
        // min value (0)
        temp[idx].min_score = 0;
        break;
      case Constants.RANKING:
        // see ../../../doc/Scoring.txt for info on this algorithm
        temp[idx].max_score = tempSQ.sort((a, b) => b.weight - a.weight)
          .reduce(
            (a, x, i) => a + x.weight * (tempSQ.length - 1 - i), 0,
          );
        temp[idx].min_score = tempSQ.sort((a, b) => a.weight - b.weight)
          .reduce(
            (a, x, i) => a + x.weight * (tempSQ.length - 1 - i), 0,
          );
        break;
      default:
        break;
    }

    setQuestions(temp);
  }

  function updateQuestionTitle(idx, title) {
    const temp = update(questions, { [idx]: { title: { $set: title } } });
    temp[idx].edit = true;
    setQuestions(temp);
  }

  function deleteQuestion(idx) {
    const temp = update(questions, { [idx]: { deleted: { $set: !questions[idx].deleted } } });
    temp[idx].edit = true;
    setQuestions(temp);
  }

  function disableQuestion(idx) {
    const temp = update(questions, { [idx]: { disabled: { $set: !questions[idx].disabled } } });
    temp[idx].edit = true;
    setQuestions(temp);
  }

  function addQuestion(type) {
    const temp = {
      type,
      title: 'New Question Title',
      subquestions: [],
      new: true,
      disabled: false,
      deleted: false,
      extra_sa: false,
      max_score: 0,
      min_score: 0,
      domain: Constants.PHYSICAL,
    };
    switch (type) {
      case 0: // short answer
        temp.subquestions.push('Question 1');
        break;
      case 1: // radio
        temp.subquestions.push({ text: 'Answer 1', weight: 0 });
        break;
      case 2: // checkbox
        temp.subquestions.push({ text: 'Answer 1', weight: 0 });
        break;
      case 3: // scale
        temp.subquestions.push({ scale: 10, note: '0 means very poor, 10 means very good', weight: 0 });
        break;
      case 4: // ranking
        temp.subquestions.push({ text: 'Answer 1', weight: 0 }, { text: 'Answer 2', weight: 0 });
        break;
      default:
        break;
    }
    const tempQ = update(questions, { $push: [temp] });
    setQuestions(tempQ);
  }

  function mapQuestions() {
    const items = [];

    for (let i = 0; i < questions.length; i += 1) {
      items.push(<Question
        key={`q-${i}`}
        props={
        {
          data: questions[i],
          idx: i,
          sendUpdate: admin ? updateQuestion : updateAnswer,
          updateTitle: admin ? updateQuestionTitle : null,
          admin,
          disableQuestion: admin ? disableQuestion : null,
          deleteQuestion: admin ? deleteQuestion : null,
        }
      }
      />);
    }

    if (items.length === 0 && fetchAttempted) {
      items.push(<p className="error" key="error">ERROR: Could not load questions. Try reloading the page.</p>);
    }

    return items;
  }

  if (!fetchAttempted) getQuestions();

  return (
    <>
      <div className="survey-container">
        <p className="survey-title">Questionnaire</p>
        {mapQuestions()}
        { admin && questions.length > 0
          ? (
            <div className="add-question">
              <p className="add-question-text">Add a question:</p>
              <div className="add-question-container">
                <ReactTooltip />
                <div className="add-question-button" data-tip="Short Answer" data-background-color="#555555" data-multiline="true" role="button" tabIndex={0} onClick={() => addQuestion(0)} onKeyDown={() => addQuestion(0)}>
                  <BsCardText size="2em" />
                </div>
                <div className="add-question-button" data-tip="Radio" data-background-color="#555555" data-multiline="true" role="button" tabIndex={0} onClick={() => addQuestion(1)} onKeyDown={() => addQuestion(1)}>
                  <BiRadioCircleMarked size="2em" />
                </div>
                <div className="add-question-button" data-tip="Checkbox" data-background-color="#555555" data-multiline="true" role="button" tabIndex={0} onClick={() => addQuestion(2)} onKeyDown={() => addQuestion(2)}>
                  <FiCheckSquare size="2em" />
                </div>
                <div className="add-question-button" data-tip="Scale" data-background-color="#555555" data-multiline="true" role="button" tabIndex={0} onClick={() => addQuestion(3)} onKeyDown={() => addQuestion(3)}>
                  <MdLinearScale size="2em" />
                </div>
                <div className="add-question-button" data-tip="Ranking" data-background-color="#555555" data-multiline="true" role="button" tabIndex={0} onClick={() => addQuestion(4)} onKeyDown={() => addQuestion(4)}>
                  <GoListOrdered size="2em" />
                </div>
              </div>
            </div>
          )
          : null}
        {submitMessage}
        <Submit props={{
          submit: () => (admin ? submit(questions) : submit(answers)),
          answers,
          admin,
        }}
        />
      </div>
    </>
  );
}
