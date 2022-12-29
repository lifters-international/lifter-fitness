export const userGetAllTrainerVideo = `
    query trainerGetAllTrainerVideo($token: String!) {
        trainerGetAllTrainerVideo(token: $token) {
            id
            clientOnly
            duration
            thumbnail
            isClient
            title
            updatedAt
            views
        }
    }
`;
