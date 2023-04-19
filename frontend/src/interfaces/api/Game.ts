import { Period } from './Period';
import { Team } from './Team';

export interface Game {
    gameId: string;
    description: string;
    league: string;
    startTime: number;
    pitchLength?: number;
    pitchWidth?: number;
    fps?: number;
    periods?: Array<Period>;
    home: Team;
    away: Team;
}

export interface AllGames {
    allGames: Array<Game>;
}
