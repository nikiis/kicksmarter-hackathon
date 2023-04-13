import { Player } from './Player';
import { Event } from './Event';

export interface Team {
    jerseyColor?: string;
    secondaryColor?: string;
    name: string;
    score?: number;
    players?: Array<Player>;
    events?: Array<Event>;
    type?: string;
}
