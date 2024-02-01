import React from "react";
import styled from "styled-components";
import { FlexCenter } from "../styled";

const CountTip = styled(FlexCenter)`
    box-sizing: border-box;
    min-width: 24px;
    height: 24px;
    margin-right: 4px;
    line-height: 24px;
    border-radius: 12px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    .icon-navigate_next:before {
        content: ">";
    }
    .icon-navigate_next,
    span.text {
        line-height: 48px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-family: MD_Icon !important;
        font-style: normal;
        font-variant: normal;
        font-weight: 400;
        line-height: 1;
        text-transform: none;
        margin-left: 3px;
    }
    padding: ${props => (props.showChildren ? "0 8px" : "0 4px 0 8px")};
    background: ${props => (props.showChildren ? "rgba(183,185,194,1)" : "#00C1DC")};
    box-shadow: ${props => (props.showChildren ? "none" : "0 1px 2px rgba(0, 0, 0, 0.24)")};
`;
export default ({ count, rowId, visible, onClick, showChildren }) => (
    <CountTip
        className="countTip"
        visible={visible && count}
        onClick={e => {
            e.stopPropagation();
            if (count) {
                onClick({ rowId, visible: !visible });
            }
        }}
        showChildren={showChildren}
    >
        <span>{count}</span>
        {count > 0 && !showChildren && <i className="icon icon-navigate_next" />}
    </CountTip>
);
