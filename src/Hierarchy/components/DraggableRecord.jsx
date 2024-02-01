import React, { useEffect, useState, useRef, useMemo } from "react";
import { dropItem, setItem, getItem } from "../util";
import cx from "classnames";
import { getEmptyImage } from "react-dnd-html5-backend";
import styled from "styled-components";
import { FlexCenter } from "../styled";
import AddRecord from "./AddRecord";
import { ITEM_TYPE } from "../config";
import CountTip from "./CountTip";
import EditableCard from "./EditableCard";
import EditingRecordItem from "./EditingRecordItem";
import RecordPortal from "./RecordPortal";
import _, { noop, pick } from "lodash";
import { useDrag, useDrop } from "react-dnd";

const OperationWrap = styled(FlexCenter)`
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translate(0px, -50%);
  padding-left: 4px;
  z-index: 2;
  height: 100%;
  .addHierarchyRecord {
    visibility: hidden;
  }
`;

const isParent = (src, tar) => {
  console.log("src,", src);
  console.log("tar,", tar);

  return JSON.stringify(tar.pathId) === JSON.stringify(src.pathId.slice(0, -1));
};

// 判断是否拖拽到父节点的兄弟节点
const isParentSibling = (src, tar) => {
  if (src.length <= 1) return false;
  if (tar.length === src.length - 1 && !isParent(src, tar)) return true;
  return false;
};

export default function DraggableRecord(props) {
  const {
    data,
    toggleChildren,
    handleAddRecord,
    updateTitleData,
    onCopySuccess = noop,
    depth,
    updateMovedRecord,
    isCharge,
    onDelete,
    showChildren,
    allowAdd,
  } = props;
  const [isEditTitle, setEditTitle] = useState(false);

  const { rowId, visible, path = [], pathId = [], children } = data;
  const recordData = data;
  const hasExpanded = _.some(children, (child) => typeof child === "object");
  const normalDisplayedRecord = hasExpanded
    ? _.filter(children, (child) => !!child && !!child.display)
    : children;
  const $ref = useRef(null);
  const $dragDropRef = useRef(null);
  //   const data = { ...recordData, rowId };
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ITEM_TYPE.ITEM,
    canDrop() {
      if (!allowAdd) {
        return false;
      }
      const draggingItem = getItem("draggingHierarchyItem") || "";

      if (data.rowId === draggingItem.rowId) return false;
      return !isParent(draggingItem, data);
    },
    drop() {
      return { data };
    },
    collect(monitor) {
      return { isOver: monitor.isOver(), canDrop: monitor.canDrop() };
    },
  });
  const [{ isDragging }, drag, connectDragPreview] = useDrag({
    item: { type: ITEM_TYPE.ITEM },
    canDrag(props) {
      return true;
    },
    begin(props) {
      setItem("draggingHierarchyItem", data);
      // 拖拽时折叠所有子记录
      data.visible = false;
      toggleChildren(data, true);
      return data;
    },

    end(item, monitor) {
      const dropResult = monitor.getDropResult();
      if (!dropResult) return;
      const draggingItem = getItem("draggingHierarchyItem") || "";
      const { data } = dropResult;
      if (!data) return;

      updateMovedRecord({ src: draggingItem, target: data });

      dropItem("draggingHierarchyItem");
    },
    collect(monitor) {
      return { isDragging: monitor.isDragging() };
    },
  });

  useEffect(() => {
    if (connectDragPreview) {
      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true,
      });
    }
  }, []);
  const closeEdit = () => {
    setEditTitle(false);
  };
  const getStyle = () => {
    const $dom = $ref.current;
    if (!$dom) return {};
    const { top, left } = $dom.getBoundingClientRect();
    return { top: top + 30, left };
  };

  drag(drop($dragDropRef));
  console.log("isEditTitle,", isEditTitle);
  return (
    <div
      className={cx("recordItemWrap", {
        normalOver: isOver && canDrop,
        directParentOver: isOver && !canDrop,
      })}
    >
      <div ref={$dragDropRef} id={rowId} className={cx("dragDropRecordWrap")}>
        <EditableCard
          data={{ ...recordData, rowId }}
          stateData={data}
          ref={$ref}
          isCharge={isCharge}
          editTitle={() => {
            setEditTitle(true);
          }}
          onCopySuccess={(data) => {
            onCopySuccess({ path, pathId, item: data });
          }}
          onDelete={() => {
            onDelete(rowId);
            console.log("delete,rowid", rowId);
          }}
          updateTitleData={updateTitleData}
          allowAdd={allowAdd}
        />
      </div>
      {isEditTitle && (
        <RecordPortal closeEdit={closeEdit}>
          <EditingRecordItem
            data={{ ...recordData, rowId }}
            stateData={data}
            isCharge={isCharge}
            style={{ ...getStyle() }}
            closeEdit={closeEdit}
            updateTitleData={updateTitleData}
          />
        </RecordPortal>
      )}
      <OperationWrap onClick={(e) => e.stopPropagation()}>
        {normalDisplayedRecord?.length > 0 && (
          <CountTip
            rowId={rowId}
            count={normalDisplayedRecord.length}
            visible={visible && hasExpanded}
            onClick={() =>
              toggleChildren({ rowId, visible: !visible, path, pathId }, true)
            }
            showChildren={showChildren}
          />
        )}
        {allowAdd && (
          <AddRecord
            onAdd={() =>
              handleAddRecord({
                title: "",
                type: "textTitle",
                path,
                pathId,
                isTextTitle: true,
                pid: rowId,
                visible,
              })
            }
          />
        )}
      </OperationWrap>
    </div>
  );
}
