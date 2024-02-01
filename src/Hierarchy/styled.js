import styled from "styled-components";
export const FlexCenter = styled.div`
    display: flex;
    align-items: center;
`;
export const Text = styled.p`
    font-size: 13px;
    color: ${props => (props.color ? props.color : "#333")};
    text-align: ${props => props.align || "initial"};
`;
export const Circle = styled(FlexCenter)`
    width: ${props => props.size || 36}px;
    height: ${props => props.size || 36}px;
    border-radius: 50%;
`;
export const AddRecord = styled(Circle)`
    background-color: #fff;
    justify-content: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);
    cursor: pointer;
    .icon-add-h:before {
        content: "+";
    }
    .icon {
        font-size: 18px;
        color: #9e9e9e;
        transition: transform 0.25s;
        &:hover {
            color: #00c1dc;
            transform: rotate(90deg);
        }
    }
`;
export const InfoWrap = styled.div`
    border: 1px solid #ddd;
    border-radius: 3px;
    color: #757575;
    line-height: 34px;
    padding: 0 12px;
    background: ${props => props.bgColor || "#fff"};
`;

export const Button = styled.button`
    width: ${props => (props.fullWidth ? "100%" : "auto")};
    padding: 0 32px;
    line-height: 36px;
    height: 36px;
    color: #fff;
    background-color: ${props => props.bgColor || "#2196f3"};
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    border: 1px solid transparent;
`;
export const RevertButton = styled(Button)`
    color: ${props => props.color || "#2196f3"};
    border: 1px solid currentColor;
    background: ${props => props.bgColor || "transparent"};
    &:hover {
        background-color: #edf7fe;
    }
`;
export const AddHRecord = styled(Circle)`
    background-color: #fff;
    justify-content: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);
    cursor: pointer;
    .icon {
        font-size: 18px;
        color: #9e9e9e;
        transition: transform 0.25s;
        &:hover {
            color: #2196f3;
            transform: rotate(90deg);
        }
    }
`;
