import { Coords, Football, Player } from '../global';

export interface PlayerPitchProps {
    parentWidth: number;
    parentHeight: number;
    originalWidth?: number;
    originalHeight?: number;
    players: Array<Player>;
    football: Football;
    isDrawEnabled?: boolean;
    leftGoalColor: string;
    rightGoalColor: string;
    isResetOpenness: boolean;
    reInitialiseOpenness: () => void;
}
