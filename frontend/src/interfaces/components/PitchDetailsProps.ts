import { Football, Player } from '../global';

export interface PitchDetailsProps {
    originalWidth?: number;
    originalHeight?: number;
    players: Array<Player>;
    totalGameTime: number;
    fps: number;
    isLoading: boolean;
    football: Football;
    leftGoalColor: string;
    rightGoalColor: string;
    onGameTimeChange: (currTime: number, index?: number) => void;
    controlRef: any;
}
