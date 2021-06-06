import { useEffect } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { MdDeleteForever } from 'react-icons/md';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { FaUndo } from 'react-icons/fa';
import { RiRecordCircleLine } from 'react-icons/ri';
import ReactTooltip from 'react-tooltip';
import update from 'immutability-helper';
import SAQuestion from '../SAQuestion';
import MCRQuestion from '../MCRQuestion';
import MCCQuestion from '../MCCQuestion';
import RankingQuestion from '../RankingQuestion';
import ScaleQuestion from '../ScaleQuestion';
import * as Constants from '../../constants';

export default function Question({ props }) {
  const {
    data, idx, admin, disableQuestion, deleteQuestion,
  } = props;

  let subquestion = null;
  let tooltipText = null;

  if (data.type === 0) {
    subquestion = <SAQuestion props={props} />;
    tooltipText = `Short Answer:
    <br />
    Type your answer to the question in the textbox below the prompt.
    `;
  } else if (data.type === 1) {
    subquestion = <MCRQuestion props={props} />;
    tooltipText = `Multiple Choice (Radio):
    <br />
    Choose a single option. If there's a textbox at the bottom, you
    <br />
    may select its respective radio button and type in your answer.
    `;
  } else if (data.type === 2) {
    subquestion = <MCCQuestion props={props} />;
    tooltipText = `Multiple Choice (Checkbox):
    <br />
    Check any number of options. If there's a textbox at
    <br />
    the bottom, you may type in your own answer as well.
    `;
  } else if (data.type === 3) {
    subquestion = <ScaleQuestion props={props} />;
    tooltipText = `Scale:
    <br />
    Drag the slider to choose the value that corresponds with your answer.
    `;
  } else if (data.type === 4) {
    subquestion = <RankingQuestion props={props} />;
    tooltipText = `Ranking:
    <br />
    Click and drag the text options in the order that corresponds with your answers.
    `;
  }

  if (!subquestion) {
    subquestion = <p className="error">{`ERROR: Question type ${data.type} not implemented yet`}</p>;
  }

  function updateDomain(value) {
    const temp = update(data, { domain: { $set: value } });
    props.sendUpdate(idx, temp);
  }

  useEffect(() => {
    ReactTooltip.hide();
    ReactTooltip.rebuild();
  });

  let qElement = <></>;
  if (admin) {
    qElement = (
      <div className={`question${data.disabled ? ' question-disabled' : ''}${data.deleted ? ' question-deleted' : ''}`}>
        <input type="text" className="question-title-edit" value={data.title ?? 'Question Title'} onChange={(e) => props.updateTitle(idx, e.target.value)} />
        <div className="question-domain">
          <RiRecordCircleLine color="#3ca5ff" size="1.5em" data-tip="Pick a domain for this question" data-background-color="#555555" />
          <select style={{ width: '100%' }} value={data.domain} onChange={(e) => updateDomain(parseInt(e.target.value, 10))}>
            <option value={Constants.PHYSICAL}>Physical</option>
            <option value={Constants.MENTAL}>Mental</option>
            <option value={Constants.EMOTIONAL}>Emotional</option>
            <option value={Constants.SPIRITUAL}>Spiritual</option>
            <option value={Constants.SOCIAL}>Social</option>
          </select>
        </div>
        {subquestion}
        {data.deleted
          ? <FaUndo className="delete-icon" onClick={() => deleteQuestion(idx)} data-tip="Un-delete the question." data-background-color="#555555" data-multiline="true" />
          : <MdDeleteForever className="delete-icon" onClick={() => deleteQuestion(idx)} data-tip="Permanently delete this question." data-background-color="#555555" data-multiline="true" />}
        {data.disabled
          ? <BsEye className="disable-icon" onClick={() => disableQuestion(idx)} data-tip="Re-enable this question,<br />so users can see it." data-background-color="#555555" data-multiline="true" />
          : <BsEyeSlash className="disable-icon" onClick={() => disableQuestion(idx)} data-tip="Disable this question.<br />Users won't be able to see it, but<br />you still can in the admin panel." data-background-color="#555555" data-multiline="true" />}
        <AiOutlineInfoCircle className="info-icon" data-tip={tooltipText} data-background-color="#555555" data-multiline="true" />
      </div>
    );
  } else {
    qElement = (
      <div className="question">
        <p className="question-title">{`${idx + 1}. ${data.title} `}</p>
        {subquestion}
        <AiOutlineInfoCircle className="info-icon" data-tip={tooltipText} data-background-color="#555555" data-multiline="true" />
      </div>
    );
  }

  return (
    <>
      <ReactTooltip />
      {qElement}
    </>
  );
}
