export const deleteTrainersVideo = `
    query DeleteTrainersVideo($deleteTrainersVideoId: String!, $token: String!) {
        deleteTrainersVideo(id: $deleteTrainersVideoId, token: $token) {
            key
            type
            value
        }
    }
`;
