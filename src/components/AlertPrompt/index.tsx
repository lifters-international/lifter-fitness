import React, { useState, useEffect } from "react";

import "./index.css"

export type AlertPromptType = "Cancel" | "Prompt" | "Ok";

export type AlertPromptStateManager = {
    show: boolean;
    type: AlertPromptType[] | "Ok";
    message: string;
    promptPlaceHolder?: string;
    okPlaceHolder?: string;
    cancelPlaceHolder?: string;
}

export type AlertPromptProps = {
    onOkay: (answer?: string) => void;
    onCancel: () => void;
} & AlertPromptStateManager;

export const AlertPrompt: React.FC<AlertPromptProps> = ({ show, type, message, promptPlaceHolder, okPlaceHolder, cancelPlaceHolder, onOkay, onCancel }) => {
    const [answer, setAnswer] = useState("");

    useEffect(() => {
        setAnswer("")
    })

    return (
        <>
            {
                show ? (
                    <div className="AlertPrompt" onClick={ ( event: any ) => {
                        if ( event.target.classList.length === 1 && event.target.classList.contains("AlertPrompt") ) {
                            onCancel()
                        }
                    }}>
                        <div className="container">
                            <div className="message">{message}</div>

                            {
                                type.includes("Prompt") && <input type="text" className="promptText" title="prompt" placeholder={promptPlaceHolder || "Answer"}
                                    defaultValue={answer || ""} onChange={
                                        (e) => {
                                            setAnswer(e.target.value)
                                        }
                                    }
                                />
                            }

                            <div className={`buttons ${type.includes("Cancel") ? " flex" : " noFlex"}`}>
                                {
                                    type.includes("Cancel") && <div className="cancel" onClick={ () => { 
                                        onCancel();
                                    }}>{cancelPlaceHolder || "Cancel"}</div>
                                }

                                <div className="okay" onClick={ () => { 
                                    onOkay(answer);
                                    onCancel()
                                }}>{okPlaceHolder || "Okay"}</div>
                            </div>

                        </div>
                    </div>
                ) : null
            }
        </>
    )
}
