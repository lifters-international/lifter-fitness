export const getApiUrl = () => {
    return `${getServerUrl()}graphql`;
}

export const getWSApiUrl = () => {
    return  `wss://${process.env.NODE_ENV === "production" ? "https://server.lifters.app" : "localhost:5000"}/graphql`;
}

export const getImageUploadApi = () => {
    return `${getServerUrl()}upload/image`;
}

export const getServerUrl = () => {
    return process.env.NODE_ENV === "production" ? "https://server.lifters.app/" : "http://localhost:5000/";
} 
