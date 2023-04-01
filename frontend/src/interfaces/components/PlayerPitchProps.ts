import { Coords, Football, Player } from '../global';

export interface PlayerPitchProps {
    parentWidth: number;
    parentHeight: number;
    players: Array<Player>;
    football: Football;
    isDrawEnabled?: boolean;
}
