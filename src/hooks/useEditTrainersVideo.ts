import React, { useState, useEffect } from 'react';

import { getTrainersVideo } from "../graphQlQuieries";
import { fetchGraphQl } from '../utils';

export type EditTrainersVideoState = {
    loading: boolean;
    videoExists: boolean;
    error: string | null;
    videoDetails?: {
        id: string;
        title: string;
        description: string;
        url: string;
        thumbnail: string;
        createdAt: number;
        updatedAt: number;
        comments: { id : string }[];
        likes: { id : string }[];
        disLikes: { id : string }[];
        viewHistory: { id : string }[];
        clientOnly: boolean;
        allowComments: boolean;
        allowLikes: boolean;
        allowDislikes: boolean;
        isPublic: boolean;
        price: number;
        commentCount: number;
        likeCount: number;
        disLikeCount: number;
    };
}

export const useEditTrainersVideo = ( token : string, videoId: string ) => {
    const [ state, setState ] = useState<EditTrainersVideoState>({
        loading: true,
        videoExists: true,
        error: null
    });

    const getVideoInformation = async () => {
        if ( token == null ) return;

        let req = await fetchGraphQl(getTrainersVideo, { token, videoId });

        let data: {
            id: string;
            title: string;
            description: string;
            url: string;
            thumbnail: string;
            createdAt: number;
            updatedAt: number;
            comments: { id : string }[];
            likes: { id : string }[];
            disLikes: { id : string }[];
            viewHistory: { id : string }[];
            clientOnly: boolean;
            allowComments: boolean;
            allowLikes: boolean;
            allowDislikes: boolean;
            isPublic: boolean;
            price: number;
        } = req.data.getTrainersVideo;

        if ( req.errors ) {
            if ( req.errors[0].message === "Video Does Not Exist." ) {
                setState({
                    ...state,
                    loading: false,
                    videoExists: false,
                })
            }else {
                setState({
                   ...state,
                    loading: false,
                    error: req.errors[0].message,
                })
            }
        }else {
            setState({
               ...state,
                loading: false,
                videoExists: true,
                videoDetails: {
                    ...data,
                    commentCount: data.comments.length,
                    likeCount: data.likes.length,
                    disLikeCount: data.disLikes.length,
                }
            })
        }

    } 

    useEffect(() => {
        getVideoInformation()
    }, [ token ]);

    return state;
}
