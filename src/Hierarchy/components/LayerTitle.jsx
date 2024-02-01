import React, { useState } from "react";
// import nzh from "nzh";
import { Input } from "antd";
import cx from "classnames";
import { useSetState } from "react-use";
import styled from "styled-components";
import update from "immutability-helper";
import { Icon } from "@ant-design/compatible";
import { BaseCardEditIcon } from "../SvgIcon";
import _ from "lodash";

const ItemTitle = styled.ul`
    background-color: #f5f5f8;
    display: flex;
    margin-bottom: 4px;
    transform-origin: left;
    padding-inline-start: 0px;
    transform: ${props => (props.scale ? `scale(${props.scale / 100})` : "scale(1)")};
    li {
        flex-basis: 280px;
        flex-shrink: 0;
        margin-left: 120px;
        font-size: 14px;
        .ant-input {
            border: none;
            padding-left: 0;
            height: 28px;
            border-bottom: 2px solid #00c1dc;
            background-color: transparent;
            font-size: 14px;
            border-radius: 0;
            font-weight: bold;
            box-shadow: none;
        }
        .anticon.edit {
            display: none;
            &:hover {
                > svg {
                    > g > path {
                        fill: #00c1dc;
                    }
                }
            }
        }
        span {
            display: inline-block;
            max-width: 260px;
            line-height: 30px;
        }
        &:first-child {
            margin: 0;
        }
        &:hover {
            .anticon.edit {
                display: flex;
            }
        }
    }
`;

export default function LayerTitle({ layerLength = 1, layersName = [], updateLayersName, scale, allowEdit }) {
    const [activeIndex, setIndex] = useState(-1);
    const [{ titles }, setNames] = useSetState({ titles: layersName });
    return (
        <ItemTitle scale={scale}>
            {Array.from({ length: layerLength }).map((item, index) => {
                const value = titles[index];
                return (
                    <li key={index}>
                        {activeIndex === index ? (
                            <Input
                                value={value}
                                autoFocus
                                onChange={e => {
                                    // 将生成数组里面的empty填充为空字符串
                                    const value = e.target.value;
                                    const startIndex = _.findIndex(titles, item => !item);
                                    const endIndex = _.findIndex(titles, item => item);
                                    if (startIndex !== endIndex) {
                                        const filledTitles = _.fill(titles, "", startIndex, endIndex);
                                        setNames({ titles: update(filledTitles, { [index]: { $set: value } }) });
                                        return;
                                    }
                                    setNames({ titles: update(titles, { [index]: { $set: value } }) });
                                }}
                                onBlur={() => {
                                    setIndex(-1);
                                    let names = [];
                                    for (let i = 0; i < titles.length; i++) {
                                        names = [...names, titles[i] || ""];
                                    }
                                    updateLayersName(names);
                                }}
                            />
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span className={cx("overflow_ellipsis", value ? "Gray_75 Bold" : "Gray_bd Bold")}>
                                    {value || `第${index + 1}级`}
                                </span>
                                {allowEdit && (
                                    <Icon
                                        className="edit"
                                        component={BaseCardEditIcon}
                                        style={{
                                            marginRight: "5px",
                                        }}
                                        onClick={allowEdit ? () => setIndex(index) : undefined}
                                    />
                                )}
                            </div>
                        )}
                    </li>
                );
            })}
        </ItemTitle>
    );
}
