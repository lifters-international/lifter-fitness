import React, { useState, useEffect } from "react";

import { TrainersDetails, fetchGraphQl } from "../utils";

import { getTrainersDetailsById } from "../graphQlQuieries";
export type useGetTrainerDetailsState = {
    loading: boolean;
    error: boolean;
    data?: TrainersDetails;
}

export const useGetTrainerDetails = ( token : string ) => {
    const [ state, setState ] = useState<useGetTrainerDetailsState>({
        loading: true,
        error: false
    });

    useEffect(() => {
        const getData = async () => {
            try {
                if ( token == null ) return;
                
                const result = await fetchGraphQl(getTrainersDetailsById, { token });

                const data = result.data.getTrainersDetails;

                setState({
                    loading: false,
                    error: false,
                    data
                });
            } catch (error) {
                setState({
                    loading: false,
                    error: true
                });
            }
        }
        getData();
    }

    , [ token ]);

    return state;
}
