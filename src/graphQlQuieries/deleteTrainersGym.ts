export const deleteTrainersGym = `
    mutation DeleteTrainerGym($gymId: String!, $token: String!) {
        deleteTrainerGym(gymId: $gymId, token: $token)
    }
`; 
