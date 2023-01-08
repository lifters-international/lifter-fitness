export const updateTrainerInofrmationMutation = `
    mutation updateTrainerInofrmationMutation($token: String!, $trainerInfor: TrainerInformationInput!) {
        updateTrainerInformation(token: $token, trainerInfor: $trainerInfor) {
            key
            value
            type
        }
    }
`;
