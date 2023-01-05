import React, { useState, useEffect } from "react";

import { Navigate, Link } from "react-router-dom";

import { useSessionHandler, usePendingClients, useAcceptedClients } from "../../hooks";

import { Loading, Error, NavBar, TrainersGym, Modal, NotifyStateManager, NotifyStateManagerType, Notify } from "../../components";

import AcceptedClientsView from "./AcceptedClientsView";

import { socket } from "../../utils";

import "./index.css";

const TrainersClient: React.FC = () => {
    const authentication = useSessionHandler();
    const [socketAuthenticated, setSocketAuthenticated] = React.useState(false);
    const pendingClients = usePendingClients(authentication.token!);
    const acceptedClients = useAcceptedClients(authentication.token!);

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

    socket.onTrainerClient("authenticated", () => {
        setSocketAuthenticated(true);
    });

    if (authentication.token && !socketAuthenticated) socket.trainerClientEmit("authenticate", { token: authentication.token!, tokenType: "trainers" });

    if ( !socketAuthenticated || pendingClients.loading || acceptedClients.loading ) return <Loading/>;

    return (
        <div className="TrainersClientPage">
            <NavBar token={authentication.token!} />
            
            <div className="PendingClientsContainer">
                <div className="PendingClientContainerContext">
                    PENDING CLIENTS
                    <div className="circle">{pendingClients.data?.length}</div>
                </div>

                <div className="PendingClientContain">
                    <div className="ClientsContain">
                        {
                            pendingClients.data?.map( ( client, index ) => {
                                return (
                                    <Link
                                        key={index}
                                        to={`/clients/?&client=${client.id}&tab=settings`}
                                        className="pending-clients"
                                        title={client.name}
                                    >
                                        <img src={client.profilePicture} alt={client.name + " pic"} className="profile-pic" />
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            <AcceptedClientsView
                token={authentication.token!}
                clients={acceptedClients.data!}
            />
        </div>
    )
}

export default TrainersClient;
