export const userLogInMutation = `
    mutation LogIn( $email : String!, $password: String! ) {
        trainerLogIn( email : $email, password: $password ) {
            token
        }
    }
`;
