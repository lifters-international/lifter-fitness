export type GetAllTrainersVideo = {
    clientOnly: boolean;
    comments: { id: string }[];
    createdAt: number;
    description: string;
    disLikes: { id: string }[];
    id: string;
    isPublic: boolean;
    likes: { id: string }[];
    thumbnail: string;
    title: string;
    updatedAt: number;
    url: string;
    viewHistory: { id: string }[];
}

export type GetAllTrainersVideoQueryResult = {
    getAllTrainersVideo: GetAllTrainersVideo[]
}