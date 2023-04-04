import { Ball } from './Ball';
import { Player } from './Player';

export interface Frame {
    period?: number;
    live?: boolean;
    lastTouch?: string;
    homePlayers: Array<Player>;
    awayPlayers: Array<Player>;
    gameClock?: number;
    frameIdx?: number;
    ball: Ball;
}
