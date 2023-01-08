export const userSignUpMutation = `
    mutation createTrainer($createAccount: CreateTrainerInput!) {
        createTrainer(createAccount: $createAccount) {
            trainer {
                id
                name
                email
                gyms {
                    location
                }
                profilePicture
                onBoardCompleted
            }

            onBoardingLink
        }
    }
`;
