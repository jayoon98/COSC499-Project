import React from 'react';
import update from 'immutability-helper';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { GiWeight } from 'react-icons/gi';
import ReactTooltip from 'react-tooltip';

export default function SAQuestion({ props }) {
  const { data, idx, admin } = props;
  const { subquestions } = data;
  const qRefs = [];

  let extra;
  let extraRefText;
  let extraRefRadio;
  if (data.extra) {
    extra = data.extra;
    extraRefText = React.createRef();
    extraRefRadio = React.createRef();
  }

  function addExtra() {
    const temp = update(data, { extra: { $set: 'Other' } });
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

  function updateSubquestion(i, value) {
    const temp = update(data, { subquestions: { [i]: { text: { $set: value } } } });
    props.sendUpdate(idx, temp);
  }

  function updateWeight(i, value) {
    const temp = update(data, { subquestions: { [i]: { weight: { $set: value } } } });
    props.sendUpdate(idx, temp);
  }

  function deleteSubquestion(i) {
    const temp = update(data, { subquestions: { $splice: [[i, 1]] } });
    props.sendUpdate(idx, temp);
  }

  function addSubquestion() {
    const temp = update(data, { subquestions: { $push: [{ text: 'New Answer', weight: 0 }] } });
    props.sendUpdate(idx, temp);
  }

  // validate answer(s) & send up
  function validate() {
    let valid = false;
    let answers = [];

    for (let i = 0; i < subquestions.length; i += 1) {
      if (qRefs[i].current.checked) {
        valid = true;
        answers.push(i);
      }
    }

    if (extra && extraRefRadio.current.checked && extraRefText.current.value !== '') {
      valid = true;
      answers.push(extraRefText.current.value.replace(/"/g, "'"));
    }
    if (!valid) answers = null;
    props.sendUpdate(idx, answers);
  }

  function mapQuestions() {
    const questions = [];

    for (let i = 0; i < subquestions.length; i += 1) {
      const r = React.createRef();
      qRefs.push(r);

      if (admin) {
        questions.push(
          <div key={`q-${idx}-${i}`}>
            <div className="question-spacing-edit">
              <input className="question-spacing" type="checkbox" disabled name={`${idx}`} value={`${idx}-${i}`} data-testid="mccQuestion" />
              <div className="question-mc-edit-container">
                <input type="text" className="question-mc-edit-input" value={subquestions ? subquestions[i].text : null} onChange={(e) => updateSubquestion(i, e.target.value)} />
              </div>
              <div className="question-weight-spaced">
                <ReactTooltip />
                <GiWeight color="#3ca5ff" data-tip="Pick a weight for this answer (negative weight = decreases score)" data-background-color="#555555" />
                <input type="number" style={{ width: '100%' }} value={subquestions[i] ? subquestions[i].weight : 0} min="-1" max="1" onChange={(e) => updateWeight(i, parseInt(e.target.value, 10))} />
              </div>
              {i > 0
                ? (
                  <AiOutlineMinusCircle
                    className="question-remove-icon"
                    size="2em"
                    onClick={() => deleteSubquestion(i)}
                  />
                )
                : (
                  <AiOutlineMinusCircle
                    className="question-remove-icon"
                    style={{ color: 'transparent', cursor: 'default' }}
                    size="2em"
                  />
                )}
            </div>
          </div>,
        );
      } else {
        questions.push(
          <div key={`q-${idx}-${i}`}>
            <div className="question-spacing">
              <input className="question-spacing" type="checkbox" name={`${idx}`} value={`${idx}-${i}`} data-testid="mccQuestion" onChange={() => validate()} ref={qRefs[i]} />
              {subquestions ? subquestions[i].text : null}
            </div>
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
          <div className="question-sa-edit" style={{ marginLeft: 0 }} key={`q-${idx}-extra`}>
            <input className="question-spacing" type="checkbox" disabled name={`${idx}`} value={`${idx}-extra`} data-testid="mccQuestion" />
            <input type="text" value={extra} className="question-sa-text-edit" onChange={(e) => updateExtra(e.target.value)} />
            <div className="question-sa-flex-edit">
              <input type="text" className="input-readonly" readOnly />
              <AiOutlineMinusCircle className="question-remove-icon" size="2em" onClick={deleteExtra} />
            </div>
          </div>,
        );
      } else {
        questions.push(
          <div className="question-add-extra-sa" onClick={addExtra} onKeyDown={addExtra} tabIndex={idx} role="button" key={`q-${idx}-extra`}>
            <AiOutlinePlusCircle className="question-add-icon" size="2em" />
            <span className="question-extra-sa-text">Add extra short answer</span>
          </div>,
        );
      }
    } else if (extra) {
      questions.push(
        <div key={`q-${idx}-extra`}>
          <p>
            <input className="question-spacing" type="checkbox" name={`${idx}`} value={`${idx}-extra`} data-testid="mcrQuestion" onChange={() => validate()} ref={extraRefRadio} />
            {extra}
          </p>
          <input
            style={
              {
                margin: '16px',
                marginTop: '0px',
                width: '80%',
                height: '35px',
              }
            }
            className="question-sa-text"
            type="text"
            data-testid="saQuestion"
            onChange={() => validate()}
            ref={extraRefText}
          />
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
