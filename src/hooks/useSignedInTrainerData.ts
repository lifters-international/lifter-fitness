import React, { useState, useEffect } from "react";

import { fetchGraphQl, GraphqlError, Trainer } from "../utils";

import { getSignedInUserQuery } from "../graphQlQuieries";

export type SignedInTrainerState = {
    loading: boolean;
    error: GraphqlError[];
    data?: Trainer;
    getTrainerDataSuccess: boolean;
}

export const useSignInTrainerData = ( token : string ) => {
    const [ state, setState ] = useState<SignedInTrainerState>({
        loading: true,
        error: [],
        getTrainerDataSuccess: false
    });

    useEffect(() => {
        if ( token == null ) return;

        const fetchData = async () => {
            const result = await fetchGraphQl(getSignedInUserQuery, { token });

            const data : { getTrainer : Trainer } = result.data;

            setState({
                ...state, 
                loading: false,
                data: data.getTrainer,
                error: result.errors,
                getTrainerDataSuccess: result.errors !== undefined ? false : true
            })
        }

        fetchData();
    }, [ token ]);

    return state;
}
