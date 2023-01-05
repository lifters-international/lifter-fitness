export const postTrainerComment = `
query PostTrainerComments($comment: String!, $videoId: String!, $token: String!) {
    postTrainerComments(comment: $comment, videoId: $videoId, token: $token) {
      id
      comment
      updatedAt
      whoCreatedName
      whoCreatedProfilePicture
    }
  }
`;
