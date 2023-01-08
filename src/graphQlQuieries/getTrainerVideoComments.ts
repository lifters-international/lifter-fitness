export const getTrainerVideoComments = `
mutation GetTrainerVideoComments($videoId: String!, $token: String!) {
    getTrainerVideoComments(videoId: $videoId, token: $token) {
      id
      comment
      updatedAt
      whoCreatedName
      whoCreatedProfilePicture
    }
  }
`;
