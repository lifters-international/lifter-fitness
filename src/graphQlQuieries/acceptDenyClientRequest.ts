export const acceptDenyClientRequest = `
mutation AcceptDenyClientRequest($clientId: String!, $accept: Boolean!, $token: String!) {
    acceptDenyClientRequest(clientId: $clientId, accept: $accept, token: $token) {
      id
    }
  }
`;
