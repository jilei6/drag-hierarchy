import React, { useState } from "react";
import { Input } from "antd";
import styled from "styled-components";
import cx from "classnames";

const EmptyHierarchyWrap = styled.div`
  .ant-input.title {
    padding: 0;
    height: 28px;
    border-radius: 0;
    border-bottom: 2px solid #2196f3;
    border-left: none;
    border-right: none;
    border-top: none;
    background-color: transparent;
    font-size: 14px;
    font-weight: bold;
    max-width: 140px;
    box-shadow: none;
  }
  .titleWrap {
    margin-bottom: 4px;
    height: 36px;
    display: flex;
    align-items: center;
    span {
      margin-bottom: 1px;
    }
  }

  .addWrap {
    box-sizing: border-box;
    width: 280px;
    padding: 0 12px;
    line-height: 48px;
    transition: all 0.25s;
    border-radius: 3px;
    background-color: #fff;
    color: #9e9e9e;
    font-weight: bold;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16);
    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.16);
    }
    &.allowAdd {
      cursor: pointer;
      &:hover {
        color: #00c1dc;
      }
    }
  }
`;

export default function EmptyHierarchy({
  allowAdd,
  onAdd,
  layersName,
  updateLayersName,
}) {
  const [isEdit, setEdit] = useState(false);
  const [value, setValue] = useState(layersName?.[0] || "");
  return (
    <EmptyHierarchyWrap>
      <div className="titleWrap">
        {isEdit ? (
          <Input
            value={value}
            className="title"
            autoFocus
            onChange={(e) => {
              setValue(e?.target?.value);
            }}
            onBlur={() => {
              setEdit(false);
              updateLayersName([value]);
            }}
          />
        ) : (
          <span
            className={cx(
              "overflow_ellipsis layerTitle",
              value ? "Gray_75 Bold" : "Gray_bd Bold"
            )}
            onClick={() => setEdit(true)}
          >
            {value || "一级"}
          </span>
        )}
      </div>

      <div onClick={onAdd} className={cx("addWrap", { allowAdd })}>
        <i className="icon-add"></i>
        <span>{allowAdd ? "添加记录" : "暂无记录"}</span>
      </div>
    </EmptyHierarchyWrap>
  );
}
