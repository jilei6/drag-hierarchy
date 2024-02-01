import React, { useRef } from "react";
import styled from "styled-components";
import cx from "classnames";
import _ from "lodash";
import { isEmpty } from "lodash";
import { Modal } from "antd";
import { Icon } from "@ant-design/compatible";
import { BaseCardEditIcon, BaseCardDeleteIcon } from "../SvgIcon";
const { confirm } = Modal;
const RecordItemWrap = styled.div`
  display: flex;
  flex-direction: ${(props) => props.coverDirection};
  justify-content: space-between;
  cursor: ${(props) => (props.canDrag ? "grab" : "pointer")};
  width: 100%;
  position: relative;
  min-height: 42px;
  .fieldContentWrap {
    flex: 1;
    padding: 10px 0;
    overflow: hidden;
  }
  .titleText {
    padding: 0 14px;
    font-size: 14px;
    font-weight: bold;
    // word-break: break-all;
    // white-space: normal;
    width: calc(100% - 55px);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    &.isGalleryView {
      white-space: nowrap;
    }
    &.maskHoverTheme {
      cursor: pointer;
      &:hover {
        color: #1d5786;
        .i.icon-eye_off {
          color: #9e9e9e !important;
        }
      }
    }
  }
  .abstractWrap {
    margin: 10px 14px 3px;
    max-height: 59px;
    overflow: hidden;
    color: #757575;
    text-overflow: ellipsis;
    white-space: break-spaces;
    word-break: break-all;
    display: -webkit-box;
    /*! autoprefixer: off */
    -webkit-line-clamp: 3 !important;
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    &.galleryViewAbstract {
      height: 72px;
    }
  }

  .fieldItem {
    max-width: 96%;
    margin-top: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .editTitleTextInput {
      border: none;
      width: 100%;
      padding: 0;
    }
    .worksheetCellPureString {
      max-width: 100%;
      padding-left: 4px;
    }
  }
  .emptyHolder {
    height: 6px;
    background-color: #f0f0f0;
    border-radius: 12px;
    width: 20px;
  }
  .moreOperate {
    position: absolute;
    top: 10px;
    right: 8px;
    width: 54px;
    line-height: 24px;
    border-radius: 3px px;
    text-align: center;
    font-size: 18px;
    margin-top: 2px;
    display: flex;
    box-shadow: none;
    align-items: center;
    .anticon.edit {
      &:hover {
        > svg {
          > g > path {
            fill: #00c1dc;
          }
        }
      }
    }
    .anticon.delete {
      &:hover {
        #BaseCardDeleteIcon {
          fill: #f9440a;
        }
      }
    }
  }
  .recordOperateWrap {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    right: 0;
    visibility: hidden;
  }
  .hoverShow {
    visibility: hidden;
  }
  &:hover {
    .hoverShow {
      visibility: flex;
    }
  }
`;

const BaseCard = (props) => {
  const {
    data = {},
    stateData = {},
    className,
    canDrag,
    editTitle,
    onDelete,
    onEdit,
    allowAdd,
  } = props;
  const $ref = useRef(null);

  if (isEmpty(data)) return null;

  const isCanQuickEdit = () => {
    return true;
  };

  const renderTitleControl = () => {
    const content = stateData?.title || "未命名";
    if (props.renderTitle) return props.renderTitle({ content });
    return (
      <div
        className={cx("titleText", {
          overflow_ellipsis: true,
          isGalleryView: false,
        })}
        title={content}
      >
        {content}
      </div>
    );
  };
  return (
    <RecordItemWrap
      ref={$ref}
      className={className}
      canDrag={canDrag}
      onDoubleClick={() => {
        if (editTitle) {
          editTitle();
        }
      }}
    >
      <div className="fieldContentWrap">{renderTitleControl()}</div>
      {allowAdd && (
        <div className="recordOperateWrap" onClick={(e) => e.stopPropagation()}>
          {isCanQuickEdit() && (
            <div className="moreOperate">
              <Icon
                className="edit"
                component={BaseCardEditIcon}
                style={{
                  marginRight: "5px",
                }}
                onClick={() => {
                  if (isCanQuickEdit()) {
                    editTitle();
                  }
                }}
              />{" "}
              <Icon
                className="delete"
                component={BaseCardDeleteIcon}
                style={{
                  marginRight: "5px",
                  marginLeft: "10px",
                }}
                onClick={() => {
                  confirm({
                    title: "是否删除该选项",
                    content: "删除且保存后该选项及其子层级选项均不可恢复",
                    okText: "删除",
                    okType: "danger",
                    cancelText: "取消",
                    onOk() {
                      onDelete();
                    },
                    onCancel() {
                      console.log("Cancel");
                    },
                  });
                }}
              />{" "}
            </div>
          )}
        </div>
      )}
    </RecordItemWrap>
  );
};

export default BaseCard;
