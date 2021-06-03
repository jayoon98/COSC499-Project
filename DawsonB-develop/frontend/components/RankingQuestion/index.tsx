import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { GiWeight } from 'react-icons/gi';
import ReactTooltip from 'react-tooltip';
import update from 'immutability-helper';
import RankingItem from '../RankingItem';
import RankingValue from '../RankingValue';

export interface Item {
  id: number,
  text: string
}

export interface ContainerState {
  items: Item[]
}

export default function RankingQuestion({ props }) {
  const { data, idx, admin } = props;
  const { subquestions } = data;
  const [items, setItems] = useState([]);

  useEffect(() => setItems(subquestions.map(
    (sq, index) => (
      { id: index, text: sq.text }),
  )), [data.subquestions]);

  let extra;
  let extraRef;
  if (data.extra) {
    extra = data.extra;
    extraRef = React.createRef();
  }

  // validate answer(s) & send up
  function validate() {
    if (admin) return;
    const answers = [];

    for (let i = 0; i < items.length; i += 1) {
      answers.push(items[i].id);
    }

    if (extra) answers.push(extraRef.current.value.replace(/"/g, "'"));

    props.sendUpdate(idx, answers);
  }

  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragItem = items[dragIndex];
      const newItems = update(items, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragItem],
        ],
      });
      setItems(
        newItems,
      );
    },
    [items],
  );
  useEffect(validate, [items]);

  const renderValue = (index: number) => (
    <RankingValue key={`q-${idx}-${index}-value`} props={{ index }} />
  );

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

  function updateSubquestion(value) {
    const temp = update(data, { subquestions: { [value.index]: { text: { $set: value.text } } } });
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

  const renderItem = (item: {id: number, text: string }, index: number) => (
    <RankingItem
      key={`q-${idx}-${item.id}`}
      props={{
        id: item.id, text: item.text, index, moveItem, admin, updateSubquestion,
      }}
    />
  );

  let question = <></>;

  if (admin) {
    question = (
      <>
        <div className="question-rank-container">
          <div className="question-rank-item-container">
            {items.map((item, i) => (
              <React.Fragment key={`q-rank-${idx}-${item.id}`}>
                <div className="question-rank-value-container">
                  {renderValue(i)}
                </div>
                <div className="question-rank-item-container-edit">
                  {renderItem(item, i)}
                  <div className="question-weight-spaced">
                    <ReactTooltip />
                    <GiWeight color="#3ca5ff" data-tip="Pick a weight for this answer (negative weight = decreases score)" data-background-color="#555555" />
                    <input type="number" style={{ width: '100%' }} value={subquestions[i] ? subquestions[i].weight : 0} min="-1" max="1" onChange={(e) => updateWeight(i, parseInt(e.target.value, 10))} />
                  </div>
                  {i > 1
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
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="question-add-subquestion" onClick={addSubquestion} onKeyDown={addSubquestion} tabIndex={2 * idx - 1} role="button">
          <AiOutlinePlusCircle className="question-add-icon" size="2em" />
          <span className="question-extra-sa-text">Add answer</span>
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
      </>
    );
  } else {
    question = (
      <>
        <div className="question-rank-container">
          <div className="question-rank-value-container">
            {subquestions ? subquestions.map((x, i) => renderValue(i)) : null}
          </div>
          <div className="question-rank-item-container">
            {items.map((item, i) => renderItem(item, i))}
          </div>
        </div>
        {extra ? (
          <div className="question-sa">
            <p className="question-sa-text">{extra}</p>
            <input type="text" data-testid="saQuestion" ref={extraRef} />
          </div>
        ) : (<></>)}
      </>
    );
  }

  return question;
}
