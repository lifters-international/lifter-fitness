export const createTrainersVideo = `
    mutation CreateTrainersVideo($input: CreateTrainerVideoInput!, $token: String!) {
        createTrainersVideo(input: $input, token: $token) {
            id
        }
    }
`;
