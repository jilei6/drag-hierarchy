import React, { Component } from "react";
import { ITEM_TYPE } from "../config";
import BaseCard from "./BaseCard";
import { DragLayer } from "react-dnd";
import { useDragLayer } from "react-dnd";

const layerStyles = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
};

export default function CustomDragLayer(props) {
    const { treeData } = props;
    const { item, isDragging, currentOffset, itemType } = useDragLayer(monitor => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));
    function getItemStyles() {
        if (!currentOffset) {
            return {
                display: "none",
            };
        }

        const { x, y } = currentOffset;
        const transform = `translate(${x}px, ${y}px) scale(${props.scale / 100})`;
        return {
            transform: transform,
            WebkitTransform: transform,
            background: "#fff",
            width: "280px",
        };
    }
    function renderItem() {
        if (itemType !== ITEM_TYPE.ITEM) return null;
        const data = treeData.find(v => v.rowId === item.rowId);

        return <BaseCard data={data} stateData={item} />;
        // return <BaseCard data={data} />;
    }

    if (!isDragging) {
        return null;
    }
    return (
        <div style={layerStyles}>
            <div style={getItemStyles()}>{renderItem()}</div>
        </div>
    );
}
