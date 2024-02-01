import React from "react";
import cx from "classnames";
import { get } from "lodash";
import { useDrop } from "react-dnd";
import { AddHRecord } from "../styled";
import { ITEM_TYPE } from "../config";

export default function LeftBoundary(props) {
  const { becomeTopLevelRecord, showAdd, onClick } = props;
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ITEM_TYPE.ITEM,
    canDrop(_, monitor) {
      const data = monitor.getItem();
      const $wrap = document.querySelector(".hierarchyViewWrap");
      return (get(data, "path") || []).length > 1 && $wrap.scrollLeft === 0;
    },
    drop(item, monitor) {
      const data = monitor.getItem();
      if (!data) return;
      if (data.path.length > 1) {
        becomeTopLevelRecord(data);
      }
    },
    collect(monitor) {
      return { isOver: monitor.isOver(), canDrop: monitor.canDrop() };
    },
  });

  return (
    <div className={cx("hierarchyViewLeftBoundary pointer")}>
      {showAdd && (
        <AddHRecord size={30} onClick={onClick}>
          <i className="icon icon-add-h" />
        </AddHRecord>
      )}
    </div>
  );
}
