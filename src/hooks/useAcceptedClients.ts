import React, { useState, useEffect } from "react";

import { getTrainersAcceptedClients } from "../graphQlQuieries";

import { TrainerAcceptedClients, fetchGraphQl, socket } from "../utils";

export type TrainerAcceptedClientsState = {
    loading: boolean;
    error: any;
    data: TrainerAcceptedClients[];
}

export const useAcceptedClients = (token: string) => {
    const [state, setState] = useState<TrainerAcceptedClientsState>({
        loading: true,
        error: [],
        data: []
    });

    const [change, setChange] = useState(false);

    const fetchChange = () => {
        fetchGraphQl(getTrainersAcceptedClients, { token }).then((res) => {
            let data: { getTrainersAcceptedClient: TrainerAcceptedClients[] } = res.data;

            if (res.errors) {
                setState(prev => {
                    return {
                        ...prev,
                        error: res.errors,
                        loading: false
                    }
                });
            } else {
                setState(prev => {
                    return {
                        ...prev,
                        data: data.getTrainersAcceptedClient,
                        loading: false
                    }
                })
            }
        });
    };

    useEffect(() => {
        if ( token === null ) return;

        fetchChange();

        if ( socket != null ) {
            socket.onTrainerClient("ChangeClientsOrder", () => {
                setChange(true);
            })
        }
    }, [token]);

    useEffect(() => {
        if ( !change ) return;

        fetchChange();
        setChange(false);
    }, [ change ])

    return state;
}
