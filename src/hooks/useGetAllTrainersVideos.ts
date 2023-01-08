import React, { useState, useEffect } from "react";

import { fetchGraphQl, GetAllTrainersVideoQueryResult, GetAllTrainersVideo } from "../utils";

import { getAllTrainersVideos } from "../graphQlQuieries";

export type useGetAllTrainersVideoState = {
    loading: boolean;
    error: boolean;
    data: GetAllTrainersVideo[];
}

export const useGetAllTrainersVideos = ( token : string ) : useGetAllTrainersVideoState=> {
    const [ state, setState ] = useState<useGetAllTrainersVideoState>({
        loading: false,
        error: false,
        data: []
    });

    useEffect( () => {
        if ( token == null ) return;

        fetchGraphQl(getAllTrainersVideos, { token })
        .then( req => {
            if ( req.errors ) {
                setState({
                    ...state,
                    loading: false,
                    error: true
                })
            }else {
                let data: GetAllTrainersVideoQueryResult = req.data;

                setState({
                    ...state,
                    loading: false,
                    data: data.getAllTrainersVideo
                })
            }
        });

    }, [ token ])

    return state;
}
