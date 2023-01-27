export const getApiUrl = () => {
    return `${getServerUrl()}graphql`;
}

export const getWSApiUrl = () => {
    return  `wss://${"https://server.lifters.app"}/graphql`;
}

export const getImageUploadApi = () => {
    return `${getServerUrl()}upload/image`;
}

export const getServerUrl = () => {
    return "https://server.lifters.app/";
} 
