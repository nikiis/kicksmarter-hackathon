import { Player } from './Player';

export interface Team {
    jerseyColor?: string;
    secondaryColor?: string;
    name: string;
    score?: number;
    players?: Array<Player>;
    type?: string;
}
