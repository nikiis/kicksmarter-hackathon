import { Player } from './Player';
import { Event } from './Event';

export interface Team {
    color?: string;
    name: string;
    score?: number;
    players?: Array<Player>;
    events?: Array<Event>;
}
