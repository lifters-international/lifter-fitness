import React, { useState, useEffect, useRef } from "react";

import { getTrainersClientAndMessages } from "../graphQlQuieries";

import { TrainersClientDetails, Food, fetchGraphQl, GraphqlError, TrainersDecision, TrainersClientMessage, socket, TrainersNotes } from "../utils";

export type TrainerClientAndMessagesDetailsState = { 
    name: string;
    profilePicture: string;
    trainersDecision: TrainersDecision;
    dateCreated: number;
    notes: TrainersNotes[];
    food: Food[];
    canSeeUserFoodHistory: boolean;
}

export type TrainerClientAndMessagesState = {
    details: TrainerClientAndMessagesDetailsState;
    messages: TrainersClientMessage[];
    error: GraphqlError[];
    loading: boolean;
    sendReadMessage?: ( messageId: string ) => void;
    sendMessage?: ( token: string, message: string, metaDataType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" ) => void;
}

export const useGetTrainersClientAndMessages = ( token: string, clientId : string ): TrainerClientAndMessagesState => {
    const [ details, setDetails ] = useState<TrainerClientAndMessagesDetailsState>({
        name: "",
        profilePicture: "",
        trainersDecision: TrainersDecision.ACCEPTED,
        dateCreated: 0,
        notes: [],
        food: [],
        canSeeUserFoodHistory: false
    });

    const [ messages, setMessages ] = useState<TrainersClientMessage[]>([]);

    const [ error, setError ] = useState<GraphqlError[]>([]);

    const [ loading, setLoading ] = useState<boolean>(true);

    const sendMessage = useRef(( token: string, message: string, metaDataType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" ) => {});

    const sendReadMessage = useRef(( messageId: string ) => {})

    useEffect(() => {
        if ( token === null || clientId === null ) return;

        fetchGraphQl( getTrainersClientAndMessages, { token, clientId })
        .then( res => {
            setLoading(false);
        
            if ( res.errors ) {
                setError(res.errors);
            } else {
                let data : TrainersClientDetails = res.data.getTrainersClientAndMessages;

                setDetails(prev => {
                    return {
                        ...prev,
                        name: data.name,
                        profilePicture: data.profilePicture,
                        trainersDecision: data.trainersDecision,
                        dateCreated: data.dateCreated,
                        notes: data.notes,
                        canSeeUserFoodHistory: data.canSeeUserFoodHistory,
                        food: data.food
                    }
                });

                setMessages(data.messages);

                socket.onTrainerClient("NewMessage", ( NewMessage: { trainerClientId: string, message: TrainersClientMessage }) => {
                    if ( NewMessage.trainerClientId === clientId ) setMessages(prev => {
                        return [...prev, NewMessage.message];
                    })
                });

                sendMessage.current = ( token: string, message: string, metaDataType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" ) => {
                    socket.trainerClientEmit("sendMessage", { token, tokenType: "trainers", trainerClientId: clientId, message, metaDataType });
                }
            
                sendReadMessage.current = ( messageId: string ) => {
                    socket.trainerClientEmit("sendReadMessage", { token, tokenType: "trainers", trainerClientId: clientId, messageId })
                }
            }

        })
    }, [ token, clientId ]);

    return {
        details,
        messages,
        error,
        loading,
        sendMessage: sendMessage.current,
        sendReadMessage: sendReadMessage.current
    }
}
