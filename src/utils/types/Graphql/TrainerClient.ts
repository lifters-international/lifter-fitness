import { Food } from "./Food";
import { TrainersDecision, TrainersNotes } from "./Trainer";

export type TrainersClientMessage = {
    id: string;
    status: "DELIVERED" | "READ";
    timeRead: number | null;
    whoSent: "LIFTERS" | "TRAINERS";
    metaDataType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
    message: string;
    createdAt: number;
};

export type TrainerPendingClients = {
    id: string;
    profilePicture: string;
    name: string;
    date: number;
}

export type TrainerAcceptedClients = {
    lastMessage: TrainersClientMessage | null;
    lastMessageDate: number | null;
    unreadMessages: number;
} & TrainerPendingClients;

export type TrainersClientDetails = {
    name: string;
    profilePicture: string;
    messages: TrainersClientMessage[];
    canSeeUserFoodHistory: boolean;
    notes: TrainersNotes[];
    /*
        THIS IS A LATER FEATURE THAT IS NOT CURRENTLY SUPPORTED
        canSeeUserWorkoutHistory: boolean;
        canSeeUserWeightHistory: boolean;
    */

    trainersDecision: TrainersDecision;

    dateCreated: number;

    food: Food[];
}
