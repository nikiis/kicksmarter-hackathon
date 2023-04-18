import { Team } from '../api/Team';

export interface MatchCardProps {
    date: string;
    type: string;
    homeTeam: Team;
    awayTeam: Team;
    altDisplay?: boolean;
}
