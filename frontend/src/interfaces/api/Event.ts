import { Player } from './Player';
import { Team } from './Team';

export interface Event {
    gameClock: number;
    player: Player;
    team: Team;
    xG: number;
    length: number;
}
