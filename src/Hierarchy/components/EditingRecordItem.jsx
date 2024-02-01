import React from "react";
import styled from "styled-components";
import EditText from "./EditText";
import BaseCard from "./BaseCard";

const EditingCardWrap = styled.div`
    position: absolute;
    width: 280px;
    border-radius: 3px;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 3px;
    z-index: 9999;
    .editTitleTextInput {
        border: none;
        width: 100%;
        padding: 10px 14px;
        resize: none;
        font-weight: 700;
    }
`;

export default function EditingRecord(props) {
    const { data, style, closeEdit, updateTitleData } = props;
    const rowId = data.rowId;
    const updateRow = (value, needUpdate) => {
        if (!needUpdate) {
            closeEdit();
            return;
        }
        if (needUpdate) {
            updateTitleData(value, rowId);
        }
        closeEdit();
    };

    const renderTitleControl = ({ content }) => {
        return (
            <EditText
                content={content}
                onBlur={(value, needUpdate) => {
                    updateRow(value, needUpdate);
                }}
            />
        );
    };

    return (
        <EditingCardWrap style={style}>
            <BaseCard {...props} renderTitle={renderTitleControl} />
        </EditingCardWrap>
    );
}
