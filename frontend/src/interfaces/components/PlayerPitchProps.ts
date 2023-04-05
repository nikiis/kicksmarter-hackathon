import { Coords, Football, Player } from '../global';

export interface PlayerPitchProps {
    parentWidth: number;
    parentHeight: number;
    originalWidth?: number;
    originalHeight?: number;
    players: Array<Player>;
    football: Football;
    isDrawEnabled?: boolean;
}
