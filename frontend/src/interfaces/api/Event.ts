import { Player } from './Player';
import { Team } from './Team';

export interface Event {
    gameClock: number;
    player: Player;
    team: Team;
    xG?: number;
    length?: number;
}

export interface AllEvents {
    shots: Array<Event>;
    progressivePasses: Array<Event>;
    progressiveCarries: Array<Event>;
    keyPasses: Array<Event>;
    goals: Array<Event>;
}
