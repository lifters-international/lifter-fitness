export const editTrainersGymLocation = `
    mutation EditTrainersGymLocation($location: String!, $gymId: String!, $token: String!) {
        editTrainersGymLocation(location: $location, gymId: $gymId, token: $token) {
            id
            location
        }
    }
`;
