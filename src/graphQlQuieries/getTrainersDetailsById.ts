export const getTrainersDetailsById = `
    query getTrainersDetails($token: String!) {
        getTrainersDetails(token: $token) {
            id
            name
            bio
            profilePicture
            bannerImage
            clientCount
            gymCount
            price
            onBoardCompleted
            gyms {
              id
              location
            }
            ratingsAverage
            ratings {
              comment
              rating
              lifter {
                id
                username
                profilePicture
              }
              id
              createdAt
            }
        }
    }
`;
