import React, { useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useSessionHandler } from "../../hooks";

import { Loading, Error, NavBar, SearchBar, TrainersGym, Modal, NotifyStateManager, NotifyStateManagerType, Notify } from "../../components";

import { MdOutlineSlowMotionVideo } from "react-icons/md";

import "./index.css";

export default function Videos() {
    const navigate = useNavigate();

    const authentication = useSessionHandler();

    if (authentication.loading) return <Loading />;

    if (authentication.error) {
        if (
            authentication.error[0].message === "jwt malformed"
            ||
            authentication.error[0].extensions.code === "BAD_USER_INPUT"
            ||
            authentication.error[0].message === "jwt expired"
        ) return <Navigate to="/createAccount" replace={true} />
        else if (
            authentication.error[0].message === "jwt expired"
            ||
            authentication.error[0].message === "Trainer does not exist."
        ) return <Navigate to="/logIn" replace={true} />
        else return <Error {...authentication.error[0]} reload={true} />;
    }

    return (
        <div className="VideosPage">
            <NavBar token={authentication.token!} />

            <div className="container">
                <div className="header">
                    <SearchBar 
                        onChange={(event) => {
                            console.log(event.target.value)
                        }}

                        placeholder="Search For Your Videos"
                        showIcon={false}
                        className="videoSearchView"
                        searchInputClass="videoSearchView_input"
                    />

                    <MdOutlineSlowMotionVideo size={60} color="#FF3636" className="createVideo" onClick={ () => navigate("/createVideo") } />
                </div>
            </div>
        </div>
    )
}
