import { useEffect, useRef, useState } from 'react';
import {
  DragPreviewImage,
  DropTargetMonitor, useDrag, useDrop, XYCoord,
} from 'react-dnd';
import update from 'immutability-helper';
import { GrDrag } from 'react-icons/gr';
import { IconContext } from 'react-icons';

interface DragItem {
  index: number,
  id: string,
  type: string
}

export default function RankingItem({ props }) {
  const {
    id, text, index, moveItem, admin,
  } = props;
  const [lastPos, setLastPos] = useState(index);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragStart, setDragStart] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'item', id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ mtr }, drop] = useDrop({
    accept: 'item',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current || admin) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const mouseOffset = monitor.getClientOffset();
      const hoverMouseY = (mouseOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverMouseY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverMouseY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);

      if (lastPos !== dragIndex) setLastPos(dragIndex);

      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
    collect: (monitor: any) => ({
      mtr: monitor,
    }),
  });

  drag(drop(ref));

  function animateDrag() {
    let newOffset = mtr.getClientOffset().y - dragStart;
    if (newOffset === dragOffset) return;

    const parentRect = ref.current.parentElement.getBoundingClientRect();

    if (dragStart + newOffset > parentRect.y + parentRect.height) {
      newOffset = parentRect.y + parentRect.height - dragStart;
    }

    if (dragStart + newOffset < parentRect.y) {
      newOffset = parentRect.y - dragStart;
    }

    setDragOffset(newOffset);
  }

  function updateDragStart() {
    const diff = index - lastPos;
    if (diff !== 0) {
      const style = window.getComputedStyle(ref.current);
      const mBottom = parseInt(style.marginBottom, 10);
      const bBottom = parseInt(style.borderBottomWidth, 10);
      const bTop = parseInt(style.borderTopWidth, 10);

      setDragStart(dragStart + diff * (ref.current.clientHeight + mBottom + bBottom + bTop));
      setLastPos(index);
    }
  }
  useEffect(updateDragStart, [index]);

  function updateText(value) {
    const temp = update(props, { text: { $set: value } });
    props.updateSubquestion(temp);
  }

  let item = <></>;
  if (admin) {
    item = (
      <>
        <DragPreviewImage connect={preview} src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
        <div
          className="question-rank-item-edit"
        >
          <IconContext.Provider value={{ className: 'react-icons' }}>
            <GrDrag />
          </IconContext.Provider>
          <input type="text" value={text} className="question-rank-item-title-edit" onChange={(e) => updateText(e.target.value)} />
        </div>
      </>
    );
  } else {
    item = (
      <>
        <DragPreviewImage connect={preview} src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
        <div
          ref={ref}
          onDragStart={(e) => setDragStart(e.clientY)}
          onDrag={() => animateDrag()}
          onDragEnd={() => setDragOffset(0)}
          style={{ top: dragOffset }}
          className={isDragging ? 'question-rank-item question-rank-item-highlight' : 'question-rank-item'}
        >
          <IconContext.Provider value={{ className: 'react-icons' }}>
            <GrDrag />
          </IconContext.Provider>
          {text}
        </div>
      </>
    );
  }

  return item;
}
