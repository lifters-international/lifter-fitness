export const updateTrainerPassword = `
    mutation updateTrainerPassword($newPassword: String!, $oldPassword: String!, $token: String!) {
        updateTrainerPassword(newPassword: $newPassword, oldPassword: $oldPassword, token: $token) {
            key
            value
            type
        }
    }
`;
