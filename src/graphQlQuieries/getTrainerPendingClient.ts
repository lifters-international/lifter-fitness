export const getTrainerPendingClients = `
mutation GetPendingTrainersClient($token: String!) {
    getPendingTrainersClient(token: $token) {
      id
      name
      profilePicture
      date
    }
  }
`;
