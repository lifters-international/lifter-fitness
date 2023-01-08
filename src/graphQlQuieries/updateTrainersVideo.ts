export const updateTrainersVideo = `
    mutation UpdateTrainersVideo($input: TrainerVideoInformationInput!, $updateTrainersVideoId: String!, $token: String!) {
        updateTrainersVideo(input: $input, id: $updateTrainersVideoId, token: $token) {
            key
            type
            value
        }
    }
`;
