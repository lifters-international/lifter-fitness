export const getSignedInUserQuery = `
    query GetTrainer($token: String!) {
        getTrainer(token: $token) {
            id
            name
            email
            bio
            profilePicture
            onBoardCompleted
            gyms {
                id
                location
            }
            price
        }
    }
`;
