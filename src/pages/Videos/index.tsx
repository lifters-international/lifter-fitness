import React, { useEffect, useState } from 'react';

import { Navigate, useNavigate } from "react-router-dom";
import { useSessionHandler } from "../../hooks";

import { Loading, Error, NavBar, TrainersGym, Modal, NotifyStateManager, NotifyStateManagerType, Notify } from "../../components";

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
            <NavBar token={authentication.token!}/>

            <div className="container">
                <h1>videos</h1>
            </div>
        </div>
    )
}
