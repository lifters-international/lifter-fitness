import React, { useState, useEffect } from "react";

import { fetchGraphQl, TrainersVideoAnalysis } from "../utils";
import { getTrainerVideoAnaylsis } from "../graphQlQuieries";

export type useGetTrainersVideoAnaylsisState = {
    loading: boolean;
    error: boolean;
    anaylsis?: TrainersVideoAnalysis;
}

export const useGetTrainerVideoAnaylsis = ( token : string, videoId: string ) => {
    let [ state, setState ] = useState<useGetTrainersVideoAnaylsisState>({
        loading: true,
        error: false
    });

    useEffect(() => {
        if ( token === null || videoId === null ) return;

        fetchGraphQl(getTrainerVideoAnaylsis, { token, videoId })
        .then( res => {
            if ( res.errors ) {
                setState({
                    ...state,
                    error: true,
                    loading: false
                })
            }else {
                setState({
                    ...state,
                    loading: false,
                    anaylsis: res.data.getTrainerVideoAnalytics
                })
            }
        })
    }, [ token, videoId ] );

    return state;
}
