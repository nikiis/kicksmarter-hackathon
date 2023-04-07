import { Football, Player } from '../global';

export interface PitchDetailsProps {
    originalWidth?: number;
    originalHeight?: number;
    players: Array<Player>;
    totalGameTime: number;
    fps: number;
    football: Football;
    leftGoalColor: string;
    rightGoalColor: string;
    onGameTimeChange: (startTime: number, index?: number) => void;
}
