import React, { useRef, useState, useEffect } from "react";
import { Input, Button } from "antd";
import SVG from "svg.js";
import styled from "styled-components";
import { getPosition } from "../util";
import _ from "lodash";
import $ from "jquery";

const CreateRecordWrap = styled.div`
    width: 280px;
    margin-bottom: 8px;
    textarea {
        padding: 12px 30px 12px 12px;
        resize: none;
    }

    .switchToCompleteCreate {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 16px;
        color: #9e9e9e;
        &:hover {
            color: #2196f3;
        }
    }
`;
export default function CreateRecord(props) {
    const { index, noConnector, itemData, scale, data, removeHierarchyTempItem, createTextTitleRecord, handleAddRecord } = props;
    const { pid, rowId, pathId } = itemData;

    // 用来防止触发失焦
    const [isOutFocus, setOutFocus] = useState(false);
    const [value, setValue] = useState("");
    const $itemWrap = useRef(null);
    const getLinesValue = () => value.trim().split("\n");
    const lines = getLinesValue();

    // 绘制连接线
    const drawConnector = () => {
        // 顶级记录没有连线
        if (!pid) return;
        const $svgWrap = document.getElementById(`svg-${pathId.join("-")}`);
        const $ele = _.get($itemWrap, ["current"]);
        if ($ele) {
            const $parent = document.getElementById(`${data.pathId.join("-")}`);
            if ($parent === $ele) return;
            const { height = 0, top = 0, start = [], end = [] } = getPosition($parent, $ele, scale);
            $($svgWrap).height(height).css({ top: -top });

            /* 为了防止连线过于重叠,处理控制点的横坐标
       靠上的记录的控制点靠右 靠下的记录控制点靠左，最右到父子记录间隔的一半即60px,最左为起点0
       */
            const controlPointX = 0;

            // 获取控制点
            const controlPoint = [controlPointX, end[1]];
            if ($svgWrap.childElementCount > 0) {
                $svgWrap.childNodes.forEach(child => $svgWrap.removeChild(child));
            }
            const draw = SVG(`svg-${pathId.join("-")}`).size("100%", "100%");
            const linePath = ["M", ...start, "Q", ...controlPoint, ...end].join(" ");
            draw.path(linePath).stroke({ width: 2, color: "#d3d3d3" }).fill("none");
        }
    };

    useEffect(() => {
        drawConnector();
    }, [index, lines.length, pid]);

    const handleClick = type => {
        setOutFocus(true);
        createTextTitleRecord(type === "multi" ? getLinesValue(value) : value);
        setValue("");
        // removeHierarchyTempItem({ rowId, path: data.path });
    };
    return (
        <div className="sortableTreeNodeWrap" id={pathId.join("-")} ref={$itemWrap}>
            <div id={`svg-${pathId.join("-")}`} className="svgWrap" />

            <CreateRecordWrap>
                <Input.TextArea
                    autoSize={{ minRows: 1, maxRows: 10 }}
                    style={{ borderColor: "#00C1DC", boxShadow: "#00C1DC" }}
                    autoFocus
                    onPressEnter={() => {
                        if (value) {
                            setOutFocus(true);
                            createTextTitleRecord(value, true, rowId);
                            setValue("");
                        } else {
                            removeHierarchyTempItem({ rowId, path: data.path, pid: data.rowId });
                        }
                    }}
                    maxLength={14}
                    onChange={e => setValue(e.target.value.trim())}
                    value={value}
                    onBlur={e => {
                        if (value) {
                            createTextTitleRecord(value, false, rowId);
                            setValue("");
                        } else {
                            removeHierarchyTempItem({ rowId, path: data.path, pid: data.rowId });
                        }
                    }}
                ></Input.TextArea>
                <div
                    className="switchToCompleteCreate pointer"
                    onMouseDown={() => {
                        setOutFocus(true);
                        handleAddRecord({ path: itemData.path, pathId: itemData.pathId });
                    }}
                >
                    <i className="icon-worksheet_enlarge"></i>
                </div>
            </CreateRecordWrap>
        </div>
    );
}
