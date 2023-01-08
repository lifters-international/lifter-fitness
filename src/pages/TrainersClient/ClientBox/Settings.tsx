import React, { useState, useRef } from "react";

import { TrainersDecision, TrainersNotes, fetchGraphQl, getDiff, Food } from "../../../utils";

import { acceptDenyClientRequest, createTrainerNotes } from "../../../graphQlQuieries";

import { Link } from "react-router-dom";

import { IoMdSend } from "react-icons/io";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

import { Food as FoodView } from "../../../components";

type SettingsProps = {
    name: string;
    profilePicture: string;
    trainersDecision: TrainersDecision;
    dateCreated: number;
    notes: TrainersNotes[];
    client: string;
    token: string;
    food: Food[];
    canSeeUserFoodHistory: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ name, profilePicture, client, trainersDecision, token, dateCreated, notes, food, canSeeUserFoodHistory }) => {
    const [acceptClientLoading, setAcceptClientLoading] = useState(false);

    const [dailyFoodDropDown, setDailyFoodDropDown] = useState(false);

    const [yourNotesDropDown, setYourNotesDropDown] = useState(false);
    const [postNewNotesLoading, setPostNewNotesLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const commentTextArea = useRef<HTMLTextAreaElement>(null);

    const acceptClient = async (accept: boolean) => {
        if (acceptClientLoading) return;

        setAcceptClientLoading(true);

        fetchGraphQl(acceptDenyClientRequest, { token, clientId: client, accept })
            .then(() => {
                setAcceptClientLoading(false);

                window.location.reload();
            })
    }

    const postNewNote = () => {
        if (postNewNotesLoading) return;

        setPostNewNotesLoading(true);

        fetchGraphQl(createTrainerNotes, { token, note: newComment, client })
            .then((res) => {
                setPostNewNotesLoading(false);

                setNewComment("");

                if (res.errors) {
                    commentTextArea.current!.value = "PROBLEM CREATING NEW NOTE";
                } else {
                    window.location.reload();
                }
            })
    }

    return (
        <div className="ClientSettings">
            <div className="ClientBoxDetails">
                <div className="client-infor">
                    <img src={profilePicture} alt={name + " picture"} className="profile-pic" />
                    <div className="client-name">{name}</div>
                </div>

                <div className="client-tabs">
                    <Link
                        to={`/clients/?&client=${client}&tab=messages`}
                        className="client-tab"
                    >
                        <IoMdSend size={40} color="#FF3636" />
                    </Link>
                </div>
            </div>

            <div className="ClientBoxContent">
                {
                    trainersDecision === TrainersDecision.VERIFYING_PAYMENT || trainersDecision === TrainersDecision.PENDING || trainersDecision === TrainersDecision.DENIED ?
                        (
                            <div className="AcceptClientBoxContent">
                                <h1 className="name">
                                    {`${trainersDecision === TrainersDecision.DENIED ? "Re-" : ""}`}
                                    Accept {name}'s as your client
                                </h1>

                                <div className="benefitContainer">
                                    <h1>Benefits</h1>

                                    <div className="benefits">
                                        <div title={`${name} will be able to message you and ask you questions`}>Messaging</div>
                                        <div title={`${name} will be able to book training sessions with you`}>Booking Sessions</div>
                                        <div title={`${name} will be able to watch your video's that you have dedicated for clients only`}>Access to client only videos</div>
                                    </div>
                                </div>

                                <div className="buttons">
                                    <div className="button"
                                        onClick={
                                            () => acceptClient(false)
                                        }
                                    >
                                        {
                                            acceptClientLoading ?
                                                "Loading..." :
                                                trainersDecision === TrainersDecision.VERIFYING_PAYMENT ?
                                                    "Verifying Payment. We will notify you once verified" : `Deny`
                                        }
                                    </div>
                                    <div className="button accept"
                                        onClick={
                                            () => acceptClient(true)
                                        }
                                    >
                                        {
                                            acceptClientLoading ?
                                                "Loading..." :
                                                trainersDecision === TrainersDecision.VERIFYING_PAYMENT ?
                                                    "Verifying Payment. We will notify you once verified" : `${trainersDecision === TrainersDecision.DENIED ? "Re-" : ""}Accept`
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="AcceptClientBoxContent accepted">
                                <h1 className="date">Client Since: {getDiff(new Date(new Date(dateCreated).toLocaleString()), new Date(new Date().toLocaleString()))} ago </h1>

                                <div className="dropdown">
                                    <h1 className="title" onClick={() => setDailyFoodDropDown(!dailyFoodDropDown)}>
                                        Client Daily Food
                                        {
                                            !dailyFoodDropDown ? <AiOutlineArrowDown size={30} className="arrow" onClick={() => setDailyFoodDropDown(true)} /> : <AiOutlineArrowUp size={30} className="arrow" onClick={() => setDailyFoodDropDown(false)} />
                                        }
                                    </h1>

                                    {
                                        !dailyFoodDropDown ? (
                                            <div className="contents">
                                                {
                                                    canSeeUserFoodHistory ?
                                                        food.map((f, index) => {
                                                            return <FoodView {...f} key={index} />
                                                        })
                                                        : <div className="NoFood">You can not see this client daily food history</div>
                                                }
                                            </div>
                                        ) : null
                                    }
                                </div>

                                <div className="dropdown">
                                    <h1 className="title" onClick={() => setYourNotesDropDown(!yourNotesDropDown)}>
                                        Your Notes
                                        {
                                            !yourNotesDropDown ? <AiOutlineArrowDown size={30} className="arrow" onClick={() => setYourNotesDropDown(true)} /> : <AiOutlineArrowUp size={30} className="arrow" onClick={() => setYourNotesDropDown(false)} />
                                        }
                                    </h1>

                                    {
                                        !yourNotesDropDown ? (
                                            <div className="contents">
                                                <div className="postNoteContainer">
                                                    <textarea placeholder="Post New Note About Client" defaultValue="" onChange={
                                                        (e) => setNewComment(e.target.value)
                                                    } ref={commentTextArea} />

                                                    <div className="note-buttons">
                                                        <button
                                                            type="button"
                                                            className="cancel"
                                                            onClick={() => { setNewComment(""); commentTextArea.current!.value = "" }}
                                                        >Cancel</button>

                                                        <button
                                                            type="button"
                                                            className="postNote"
                                                            onClick={() => {
                                                                if (newComment.length > 0) {
                                                                    postNewNote()
                                                                }
                                                            }}
                                                        >Create Note</button>
                                                    </div>
                                                </div>

                                                <div className="notes">
                                                    {
                                                        notes.sort((a, b) => b.updatedAt - a.updatedAt).map((note, index) => {
                                                            return (
                                                                <div className="note" key={index}>
                                                                    <div>
                                                                        <span className="date">{getDiff(new Date(new Date(note.updatedAt).toLocaleString()), new Date(new Date().toLocaleString()))} ago</span>
                                                                    </div>
                                                                    <div className="content">{note.note}</div>
                                                                </div>

                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        ) : null
                                    }
                                </div>

                                <div className="button"
                                    onClick={
                                        () => acceptClient(false)
                                    }

                                    title="This will end the client subscription and delete them as a client"
                                >
                                    {
                                        acceptClientLoading ?
                                            "Loading..." : `Remove Client`
                                    }
                                </div>
                            </div>
                        )
                }
            </div>
        </div>
    )
}
