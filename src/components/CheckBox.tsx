import React, { useState, useEffect } from "react";

import { LabelInputDiv } from "./LabelInputDiv";

export const CheckBox: React.FC<{ checked: boolean, label: string, des?: string, onChange?: (value: boolean) => void }> = ({ checked, label, des, onChange }) => {
    const [checkedState, setCheckedState] = useState<boolean>();

    useEffect( () => {
        setCheckedState(checked);
    }, [checked])

    const handleChange = () => {
        if (onChange) onChange(!checkedState);
        setCheckedState(!checkedState);
    };

    return (
        <LabelInputDiv>
            <div>
                <label>{label}</label>
                <input
                    type="checkbox"
                    name="allowComments"
                    placeholder="Yes it is commentable"
                    checked={checkedState}
                    value={checkedState === true  ? "on": "off"}
                    onChange={handleChange}
                />

                <div>{des}</div>
            </div>

        </LabelInputDiv>
    )
}
