export const addNewTrainersGym = `
    mutation addNewTrainersGym($token: String!, $location: String!) {
        addGymToTrainer(token: $token, location: $location) {
            id
            location
        }
    }
`;
