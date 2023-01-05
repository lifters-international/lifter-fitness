export const getTrainersAcceptedClients = `
mutation GetTrainersAcceptedClient($token: String!) {
    getTrainersAcceptedClient(token: $token) {
      id
      name
      profilePicture
      lastMessage {
        id
        message
        createdAt
        metaDataType
        status
        timeRead
        whoSent
      }
      date
      lastMessageDate
      unreadMessages
    }
  }
`;
