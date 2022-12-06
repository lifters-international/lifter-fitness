import React, { useState } from 'react';

import { fetchGraphQl, GraphqlError, RequestResult, delay, TrainerInformationToSave } from '../utils';

import { updateTrainerInofrmationMutation } from "../graphQlQuieries";

export type useSaveTrainerProfileChangesProps = {
    token: string;
    trainerInfor: TrainerInformationToSave;
}

export type SaveTrainerInofrmationState = {
    isSaving: boolean;
    result?: RequestResult;
    error: GraphqlError[];
    saveSuccessfully: boolean;
    save: ( params: useSaveTrainerProfileChangesProps ) => void;
    saveAsync: ( params: useSaveTrainerProfileChangesProps ) => Promise<void>;
}

export const useSaveTrainerProfileChanges = (): SaveTrainerInofrmationState => {
    const [ state, setState ] = useState<SaveTrainerInofrmationState>({
        isSaving: false,
        saveSuccessfully: false,
        error: [],
        save ( params : useSaveTrainerProfileChangesProps ) {
            state.saveAsync(params);
        },

        saveAsync: async ( params: useSaveTrainerProfileChangesProps ) => {
            setState({
                ...state,
                isSaving: true,
            });

            const result = await fetchGraphQl(updateTrainerInofrmationMutation, params);

            const data : { updateTrainerInformation : RequestResult } = result.data;
            console.log(result)
            if  ( data.updateTrainerInformation.type === "successful" ) {
                setState({
                    ...state,
                    isSaving: false,
                    result: data.updateTrainerInformation
                });

                await delay(1000);

                setState({
                    ...state,
                    saveSuccessfully: true
                });

                await delay(1000);

                setState({
                    ...state,
                    saveSuccessfully: false
                });
            }
        }
    });

    return state;
}
