import React, { useState, useEffect } from "react";

import { fetchGraphQl, GraphqlError, TrainersVideoComments } from "../utils";
import { getTrainerVideoComments, postTrainerComment } from "../graphQlQuieries";

type TrainersVideoCommentsState = {
    loading: boolean;
    error: boolean;
    errorPostComment: GraphqlError[];
    comments: Array<TrainersVideoComments>;
    postComment: ( comment: string ) => void;
};


export const useGetTrainersVideoComments = ( token: string, videoId: string ) => {
    const [ state, setState ] = useState<TrainersVideoCommentsState>({
        loading: true,
        error: false,
        comments: [],
        errorPostComment: [],
        postComment: ( comment : string ) => {}
    });

    useEffect(() => {
        if ( token === null || videoId === null ) return;

        fetchGraphQl(getTrainerVideoComments, { token, videoId })
        .then( res => {
            if ( res.errors ) {
                setState({
                    ...state,
                    loading: false,
                    error: true,
                    comments: []
                });
            }else {
                setState({
                    ...state,
                    loading: false,
                    error: false,
                    comments: res.data.getTrainerVideoComments,
                    postComment: ( comment : string ) => {
                        if ( token === null || videoId === null ) return;
            
                        setState({
                            ...state,
                            loading: true
                        })
            
                        fetchGraphQl(postTrainerComment, { token, videoId, comment })
                        .then( res => {
                            if ( res.errors ) {
                                setState({
                                    ...state,
                                    loading: false,
                                    errorPostComment: res.errors
                                })
                            }else {
                                setState(prev => {
                                    return {
                                        ...prev,
                                        loading: false,
                                        errorPostComment: [],
                                        comments: prev.comments.concat(res.data.postTrainerComments)
                                    }
                                })
                            }
                        })
            
                    }
                });

            }
        })
    }, [ token, videoId ]);

    return state;
}

