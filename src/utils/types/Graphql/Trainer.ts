import { TrainersGym } from './TrainersGym';

export type Trainer = {
    id: string;
    name: string;
    email: string;
    bio: string;
    gyms?: TrainersGym[];
    profilePicture: string;
    bannerImage: string;
    onBoardCompleted: boolean;
    price: number;
};

export type TrainersSummary = {
    id: string;
    name: string;
    bio: string;
    profilePicture: string;
    price: string;
    ratingsAverage: number;
}

export type TrainersRatings = {
    id: string
    rating: number;
    lifterName: string;
    lifterProfilePicture: string;
    comment: string;
    createdAt: number;
    trainer?: Trainers;
}

export type Trainers = {
    bannerImage: string;
    bio: string;
    clients: TrainersClient[];
    email: string;
    gyms: TrainersGym[];
    id: string;
    onBoardCompleted: boolean;
    price: number;
    profilePicture: string;
    ratings: TrainersRatings[];
}

export type UserData = {
    id: string;
    username: string;
    email: string;
    age: number;
    gender: string;
    genderOfPrefense: string;
    bio: string;
    profilePicture: string;
    homeGymLocation: string;
};

export enum TrainersDecision {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DENIED = "DENIED",
    VERIFYING_PAYMENT = "VERIFYING_PAYMENT"
}

export type TrainersClient = {
    canSeeUserFoodHistory: boolean;
    canSeeUserWorkoutHistory: boolean;
    canSeeUserWeightHistory: boolean;
    client: UserData;
    id: string;
    trainer: Trainers;
    trainersDecision: TrainersDecision;
}

export type TrainersDetails = {
    bannerImage: string;

    clientCount: number;

    gymCount: number;

    gyms: TrainersGym[];

    ratingsAverage: number;

    ratings: TrainersRatings[];

    onBoardCompleted: boolean;
} & TrainersSummary;

export type TrainerVideoSummary = {
    id: string;
    clientOnly: boolean;
    duration: number;
    thumbnail: string;
    isClient: boolean;
    title: string;
    updatedAt: number;
    views: number
}

export type TrainersVideoAnalysis = {
    totalViews: number;
    
    watchTime: {
        averageWatchTime: number;
        averageClientWatchTime: number;
        averageNonClientWatchTime: number;
    },

    viewCategory: {
        views: {
            gender: {
                maleViews: number;
                femaleViews: number;
                other: number;
            },

            age: {
                under18: number;
                above18under30: number;
                above30under50: number;
                above50: number;
            },

            client: {
                clientViews: number;
                nonClientViews: number;
            }
        },

        months: {
            thisMonthViews: number;
            lastMonthViews: number;
            thisMonthClientViews: number;
            lastMonthClientViews: number;
            thisMonthNonClientViews: number;
            lastMonthNonClientViews: number;
        }
    },

    engagementCategory: {
        totalEngagement: number;
        clientEngagement: number
        NonClientEngagement: number;
    },

    likesAndDislikesCategory: {
        likes: {
            clientLikes: number;
            nonClientLikes: number;
        },

        disLikes: {
            clientDislike: number;
            nonClientDislike: number;
        }
    }
}

export type TrainersVideoComments = {
    id: string;
    comment: string;
    updatedAt: number;
    whoCreatedName: string;
    whoCreatedProfilePicture: string;
}

export type TrainersNotes = {
    id: string;
    note: string;
    updatedAt: number;
    createdAt: number;
}
