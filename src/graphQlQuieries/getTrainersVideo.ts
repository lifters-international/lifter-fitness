export const getTrainersVideo = `
    query GetTrainerVideo($token: String!, $videoId: String!) {
        getTrainersVideo(token: $token, id: $videoId) {
            id
            title
            description
            url
            thumbnail
            createdAt
            updatedAt
            comments {
                id
            }
            likes {
                id
            }
            disLikes {
                id
            }
            viewHistory {
                id
            }
            clientOnly
            allowComments
            allowLikes
            allowDislikes
            isPublic
            price
            trainer {
                id
                name
                profilePicture
            }
        }
    }
`;
