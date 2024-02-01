import React from "react";
import { AddRecord } from "../styled";

const AddRecordFun = ({ onAdd }) => (
  <AddRecord
    size={24}
    className="addHierarchyRecord"
    onClick={(e) => {
      e.stopPropagation();
      onAdd();
    }}
  >
    <i className="icon icon-add-h" />
  </AddRecord>
);
export default AddRecordFun;
