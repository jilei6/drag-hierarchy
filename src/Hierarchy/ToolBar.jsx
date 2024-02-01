import React, { Component } from "react";
import styled, { css } from "styled-components";
import cx from "classnames";
import { Button } from "antd";
import { Icon } from "@ant-design/compatible";
import { Select } from "antd";
import { FlexCenter } from "./styled";
import { getItem, setItem } from "./util";
import { ExpendLevelIcon } from "./SvgIcon";
import "./index.css";

const SCALE_LIMIT = {
  min: 50,
  max: 100,
};

const ToolBarWrap = styled(FlexCenter)`
  position: relative;
  background-color: #fff;
  border-radius: 4px;
  height: 40px;
  // padding: 0 20px 0 16px;
  z-index: 9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.16);
  margin-right: 10px;
  .adjustScale {
    display: flex;
    align-items: center;
    .searchIcon {
      color: #757575;
    }
  }
  .toOrigin {
    margin: 0 12px;
  }
  .genScreenshot,
  .toOrigin {
    cursor: pointer;
  }
  .disableAdjustSize {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .expand {
    .Dropdown--input {
      padding: 5px 7px 5px 18px;
      .value {
        font-size: 13px;
      }
      .icon {
        margin-left: 4px !important;
      }
    }
  }
`;
const ToolBarBox = styled.div`
  position: absolute;
  bottom: 32px;
  left: 24px;
  height: 40px;
  // padding: 0 20px 0 16px;
  z-index: 9;
  display: flex;
`;
const SelectWrap = styled(Select)`
  width: 70px;
  .ant-select-selection {
    border: none;
  }
  .ant-select-selection-item {
    text-align: center;
  }
  .ant-select-open .ant-select-selection {
    border-color: unset;
  }
  .ant-select-focused .ant-select-selection,
  .ant-select-selection:focus,
  .ant-select-selection:active {
    box-shadow: none;
  }
  &.ant-select-single.ant-select-open .ant-select-selection-item {
    color: inherit;
  }
  .ant-select-selection-search-input {
    display: none;
  }
  &:hover {
    .icon-arrow-down {
      color: #2196f3 !important;
    }
  }
`;
const ScaleWrap = styled.div`
  width: 140px;
  .ant-select-selection {
    border: none;
  }
  .scale-icon-box {
    width: 24px;
    height: 24px;
    // background: #f5f7fa;
    border-radius: 2px 2px 2px 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background: #f5f7fa;
    }
  }
  .scale {
    font-size: 13px;
    color: #515151;
    width: 62px;
    margin-left: 4px;
    text-align: center;
    margin-right: 4px;
  }
  .ant-select-selection-item {
    text-align: center;
  }
  .ant-select-open .ant-select-selection {
    border-color: unset;
  }
  .ant-select-focused .ant-select-selection,
  .ant-select-selection:focus,
  .ant-select-selection:active {
    box-shadow: none;
  }
  &.ant-select-single.ant-select-open .ant-select-selection-item {
    color: inherit;
  }
  .ant-select-selection-search-input {
    display: none;
  }
  &:hover {
    .icon-arrow-down {
      color: #2196f3 !important;
    }
  }
`;

const DISPLAY_HIERARCHY = [
  { value: 1, name: "1级" },
  { value: 2, name: "2级" },
  { value: 3, name: "3级" },
  { value: 4, name: "4级" },
  { value: 5, name: "5级" },
];
export default class ToolBar extends Component {
  updateStorage = (data) => {
    const config = getItem(`hierarchyConfig`) || {};
    setItem(`hierarchyConfig`, { ...config, ...data });
  };

  changeDisplayLevel = (value) => {
    this.props.showLevelData({ layer: value });
    this.updateStorage({ level: value });
  };

  adjustSize = (type) => {
    const { scale, onClick } = this.props;
    const nextScale =
      type === "shrink"
        ? Math.max(SCALE_LIMIT.min, scale - 10)
        : Math.min(SCALE_LIMIT.max, scale + 10);
    onClick("adjustScale", { scale: nextScale });
    this.updateStorage({ scale: nextScale });
  };
  render() {
    const { scale, level, onSave, saveDisabled } = this.props;
    return (
      <ToolBarBox>
        <ToolBarWrap className="flexRow valignWrappe">
          <ScaleWrap className="toolItem adjustScale" key={"scale-box"}>
            <div className="scale-icon-box" style={{ marginLeft: "12px" }}>
              {" "}
              <Icon
                type="minus"
                className={cx("Font19 Gray_75 pointer mRight12 mLeft12", {
                  disableAdjustSize: scale <= SCALE_LIMIT.min,
                })}
                style={{ color: "#333333" }}
                onClick={() =>
                  scale > SCALE_LIMIT.min && this.adjustSize("shrink")
                }
              />
            </div>
            {<div className="scale">{`${scale}%`}</div>}
            <div className="scale-icon-box">
              {" "}
              <Icon
                type="plus"
                className={cx("Font19 Gray_75 pointer mLeft6", {
                  disableAdjustSize: scale >= SCALE_LIMIT.max,
                })}
                style={{ color: "#333333" }}
                onClick={() =>
                  scale < SCALE_LIMIT.max && this.adjustSize("enlarge")
                }
              />
            </div>
          </ScaleWrap>
        </ToolBarWrap>
        <ToolBarWrap className="flexRow valignWrappe">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Icon
              component={ExpendLevelIcon}
              style={{
                marginLeft: "17px",
                marginRight: "8px",
              }}
            />
            <span style={{ color: "#333333" }}>展开</span>
          </div>
          <div
            style={{
              border: `1px solid rgba(217, 217, 217,0.5)`,
              height: "16px",
              marginTop: "-1px",
              marginLeft: "8px",
            }}
          />

          <SelectWrap
            defaultActiveFirstOption={false}
            defaultOpen={false}
            popupClassName="gunterToolBarSelectWrapper"
            bordered={false}
            value={level === -1 ? "全部" : level}
            virtual={false}
            onChange={this.changeDisplayLevel}
          >
            {DISPLAY_HIERARCHY.map((item) => (
              <Select.Option
                key={item.value}
                value={item.value}
                className="gunterToolBarSelectOptionWrapper"
              >
                {item.name}
              </Select.Option>
            ))}
          </SelectWrap>
        </ToolBarWrap>
        {onSave && (
          <Button
            disabled={saveDisabled}
            // type="primary"
            size="middle"
            style={{
              marginLeft: "5px",
              height: "40px",
              backgroundColor: saveDisabled ? "rgba(167,226,236,1)" : "#00C1DC",
              border: "none",
              boxShadow: "none",
              color: "white",
              width: "72px",
              cursor: saveDisabled ? "not-allowed" : "pointer",
            }}
            onClick={saveDisabled ? null : onSave}
          >
            {saveDisabled ? "已保存" : "保存"}
          </Button>
        )}
      </ToolBarBox>
    );
  }
}
