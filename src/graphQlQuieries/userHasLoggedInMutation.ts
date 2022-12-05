export const userHasLoggedInMutation = `
    mutation isTrainerLoggedIn($token: String!) {
        isTrainerLoggedIn(token: $token)
    }
`;
