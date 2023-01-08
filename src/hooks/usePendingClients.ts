import React, { useEffect, useState } from "react";

import { getTrainerPendingClients } from "../graphQlQuieries";

import { fetchGraphQl, TrainerPendingClients, socket } from "../utils";

export type PendingClientsState = {
    loading: boolean;
    error: any;
    data: TrainerPendingClients[];
}

export const usePendingClients = ( token : string ) => {
    const [ state, setState ] = useState<PendingClientsState>({
        loading: true,
        error: [],
        data: []
    });

    useEffect(() => {
        if ( token === null ) return;

        fetchGraphQl(getTrainerPendingClients, { token }).then( result => {
            let data: { getPendingTrainersClient: TrainerPendingClients[] } = result.data;

            if ( result.errors ) {
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        error: result.errors
                    }
                });
            }else {
                setState(prevState => {
                    return {
                        ...prevState,
                        loading: false,
                        data: data.getPendingTrainersClient
                    }
                });

                if ( socket != null ) {
                    socket.onTrainerClient("newClientPending", (newPendingClient: TrainerPendingClients ) => {
                        setState(prevState => {
                            return {
                                ...prevState,
                                data: [...prevState.data, newPendingClient]
                            }
                        })
                    })
                }
            }
        });
    }, [ token ]);

    return state;
}
