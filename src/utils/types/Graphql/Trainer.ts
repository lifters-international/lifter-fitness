import { TrainersGym } from './TrainersGym';

export type Trainer = {
    id: string;
    name: string;
    email: string;
    bio: string;
    gyms?: TrainersGym[];
    profilePicture: string;
    onBoardCompleted: boolean;
};
