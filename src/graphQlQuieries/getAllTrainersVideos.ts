export const getAllTrainersVideos = `
    query GetAllTrainersVideo($token: String!) {
        getAllTrainersVideo(token: $token) {
            clientOnly
            comments {
                id
            }
            createdAt
            description
            disLikes {
                id
            }
            id
            isPublic
            likes {
                id
            }
            thumbnail
            title
            updatedAt
            url
            viewHistory {
                id
            }
        }
    }
`;
