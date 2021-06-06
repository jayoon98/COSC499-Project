import React, { useState } from 'react';
import update from 'immutability-helper';
import ReactSlider from 'react-slider';
import { GiWeight } from 'react-icons/gi';
import ReactTooltip from 'react-tooltip';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';

export default function ScaleQuestion({ props }) {
  const { data, idx, admin } = props;
  const { scale, note, weight } = data.subquestions[0];
  const markClass = (scale <= 20 ? 'question-scale-slider-mark' : '');
  const [sliderValue, setSliderValue] = useState(null);

  let extra;
  let extraRef;
  if (data.extra) {
    extra = data.extra;
    extraRef = React.createRef();
  }

  function validate(value) {
    if (sliderValue !== value) setSliderValue(value);

    let answers = [];
    answers.push(value);
    if (extra) answers.push(extraRef.current.value.replace(/"/g, "'"));
    if (sliderValue == null) answers = null;

    props.sendUpdate(idx, answers);
  }

  function updateNote(value) {
    const temp = update(data, { subquestions: { 0: { note: { $set: value } } } });
    props.sendUpdate(idx, temp);
  }

  function updateScale(value) {
    const temp = update(data, { subquestions: { 0: { scale: { $set: value } } } });
    props.sendUpdate(idx, temp);
  }

  function updateWeight(value) {
    const temp = update(data, { subquestions: { 0: { weight: { $set: value } } } });
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

  let question = <></>;

  if (admin) {
    question = (
      <div style={{ textAlign: 'center', paddingTop: '1em' }}>
        <div className="question-weight">
          <ReactTooltip />
          <GiWeight color="#3ca5ff" data-tip="Pick a weight for this answer (negative weight = decreases score)" data-background-color="#555555" />
          <input type="number" style={{ width: '100%' }} value={weight} min="-1" max="1" onChange={(e) => updateWeight(parseInt(e.target.value, 10))} />
        </div>
        <br />
        <input type="text" value={note} className="question-scale-text-edit" onChange={(e) => updateNote(e.target.value)} />
        <div className="question-scale" data-testid="scaleQuestion">
          <ReactSlider
            className="question-scale-slider"
            marks
            markClassName={markClass}
            min={0}
            max={scale}
            thumbClassName="question-scale-slider-thumb"
            trackClassName="question-scale-slider-track"
          />
          <div className="question-scale-slider-bg" />
        </div>
        <div className="question-scale-slider-value">
          <input className="question-scale-edit-scale" value={scale} onChange={(e) => updateScale(e.target.value.replaceAll('[^0-9.]', ''))} />
        </div>

        {extra ? (
          <div className="question-sa-edit" key={`q-${idx}-extra`}>
            <input type="text" value={extra} className="question-sa-text-edit" onChange={(e) => updateExtra(e.target.value)} />
            <div className="question-sa-flex-edit">
              <input type="text" className="input-readonly" readOnly />
              <AiOutlineMinusCircle className="question-remove-icon" size="2em" onClick={deleteExtra} />
            </div>
          </div>
        ) : (
          <div className="question-add-extra-sa" onClick={addExtra} onKeyDown={addExtra} tabIndex={idx} role="button">
            <AiOutlinePlusCircle className="question-add-icon" size="2em" />
            <span className="question-extra-sa-text">Add extra short answer</span>
          </div>
        )}
      </div>
    );
  } else {
    question = (
      <>
        <p className="question-scale-text">
          {note}
        </p>
        <div className="question-scale" data-testid="scaleQuestion">
          <ReactSlider
            className="question-scale-slider"
            marks
            markClassName={markClass}
            min={0}
            max={scale}
            thumbClassName="question-scale-slider-thumb"
            trackClassName="question-scale-slider-track"
            onChange={(value) => validate(value)}
            onSliderClick={(value) => validate(value)}
          />
          <div className="question-scale-slider-bg" />
        </div>
        <div className="question-scale-slider-value">
          <p className="question-scale-slider-value-text">{sliderValue}</p>
        </div>

        {extra ? (
          <div className="question-sa">
            <p className="question-sa-text">{extra}</p>
            <input type="text" data-testid="saQuestion" onBlur={() => validate(sliderValue)} ref={extraRef} />
          </div>
        ) : (<></>)}
      </>
    );
  }

  return question;
}
