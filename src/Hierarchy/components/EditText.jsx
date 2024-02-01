import React, { useState, useEffect, useRef } from "react";
import { Input } from "antd";

export default function EditText({ content, onBlur, style }) {
    const [value, setValue] = useState(content);
    const $ref = useRef(null);
    useEffect(() => {
        setTimeout(() => {
            const $dom = $ref.current;
            if (!$dom) return;
            $dom.select();
            $dom.focus();
        }, 200);
    }, []);
    return (
        <Input
            ref={t_ref => {
                if (t_ref) {
                    $ref.current = t_ref;
                }
            }}
            defaultValue={value}
            style={{
                boxShadow: "none",
                border: "none",
                wordBreak: "break-all",
                minHeight: "22px",
                marginBottom: "-6px",
                padding: "0 14px",
                ...style,
            }}
            maxLength={14}
            className="editTitleTextInput"
            value={value}
            onChange={e => {
                setValue(e.target.value);
            }}
            onBlur={() => {
                onBlur(value, value !== content);
            }}
        />
    );
}
