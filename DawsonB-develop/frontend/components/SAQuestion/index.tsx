import React from 'react';
import update from 'immutability-helper';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';

export default function SAQuestion({ props }) {
  const { data, idx, admin } = props;
  const { subquestions } = data;
  const qRefs = [];

  let extra;
  let extraRef;
  if (data.extra) {
    extra = data.extra;
    extraRef = React.createRef();
  }

  // validate answer(s) & send up
  function validate() {
    let valid = true;
    let answers = [];

    for (let i = 0; i < subquestions.length; i += 1) {
      answers.push(qRefs[i].current.value.replace(/"/g, "'"));

      if (qRefs[i].current.value === '') {
        valid = false;
        break;
      }
    }

    if (extra) answers.push(extraRef.current.value.replace(/"/g, "'"));

    if (!valid) answers = null;
    props.sendUpdate(idx, answers);
  }

  function addSubquestion() {
    const temp = update(data, { subquestions: { $push: ['New Answer'] } });
    props.sendUpdate(idx, temp);
  }

  function deleteSubquestion(i) {
    const temp = update(data, { subquestions: { $splice: [[i, 1]] } });
    props.sendUpdate(idx, temp);
  }

  function updateSubquestion(i, value) {
    const temp = update(data, { subquestions: { [i]: { $set: value } } });
    props.sendUpdate(idx, temp);
  }

  function addExtra() {
    const temp = update(data, { extra: { $set: 'Extra Short Answer' } });
    props.sendUpdate(idx, temp);
  }

  function deleteExtra() {
    const temp = update(data, { $unset: ['extra'] });
    props.sendUpdate(idx, temp);
  }

  function updateExtra(value) {
    const temp = update(data, { extra: { $set: value } });
    props.sendUpdate(idx, temp);
  }

  function mapQuestions() {
    const questions = [];

    for (let i = 0; i < subquestions.length; i += 1) {
      const r = React.createRef();
      qRefs.push(r);

      if (admin) {
        questions.push(
          <div className="question-sa-edit" key={`q-${idx}-${i}`}>
            <input type="text" value={subquestions[i] ?? 'Subquestion title'} className="question-sa-text-edit" onChange={(e) => updateSubquestion(i, e.target.value)} />
            <div className="question-sa-flex-edit">
              <input type="text" className="input-readonly" readOnly />
              {i > 0
                ? (
                  <AiOutlineMinusCircle className="question-remove-icon" size="2em" onClick={() => deleteSubquestion(i)} />
                )
                : (
                  <AiOutlineMinusCircle className="question-remove-icon" style={{ color: 'transparent', cursor: 'default' }} size="2em" onClick={() => deleteSubquestion(i)} />
                )}
            </div>
          </div>,
        );
      } else {
        questions.push(
          <div className="question-sa" key={`q-${idx}-${i}`}>
            <p className="question-sa-text">{subquestions[i]}</p>
            <input type="text" data-testid="saQuestion" onChange={() => validate()} ref={qRefs[i]} />
          </div>,
        );
      }
    }

    if (admin) {
      questions.push(
        <div className="question-add-subquestion" key={`q-${idx}-add`} onClick={addSubquestion} onKeyDown={addSubquestion} tabIndex={2 * idx - 1} role="button">
          <AiOutlinePlusCircle className="question-add-icon" size="2em" />
          <span className="question-extra-sa-text">Add answer</span>
        </div>,
      );
      if (extra) {
        questions.push(
          <div className="question-sa-edit" key={`q-${idx}-extra`}>
            <input type="text" value={extra} className="question-sa-text-edit" onChange={(e) => updateExtra(e.target.value)} />
            <div className="question-sa-flex-edit">
              <input type="text" className="input-readonly" readOnly />
              <AiOutlineMinusCircle className="question-remove-icon" size="2em" onClick={deleteExtra} />
            </div>
          </div>,
        );
      } else {
        questions.push(
          <div className="question-add-extra-sa" key={`q-${idx}-extra`} onClick={addExtra} onKeyDown={addExtra} tabIndex={2 * idx} role="button">
            <AiOutlinePlusCircle className="question-add-icon" size="2em" />
            <span className="question-extra-sa-text">Add extra short answer</span>
          </div>,
        );
      }
    } else if (extra) {
      questions.push(
        <div className="question-sa" key={`q-${idx}-extra`}>
          <p className="question-sa-text">{extra}</p>
          <input type="text" data-testid="saQuestion" onChange={() => validate()} ref={extraRef} />
        </div>,
      );
    }

    return questions;
  }

  return (
    <>
      {mapQuestions()}
    </>
  );
}
