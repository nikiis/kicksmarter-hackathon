import { EventType } from './enums/enums';

export interface Player {
    id: string;
    playerNumber: number;
    x?: number;
    y?: number;
    jerseyColor: string;
    secondaryColor: string;
    openness: number;
    position?: string;
}

export interface Coords {
    x: number;
    y: number;
}

export interface Football {
    x: number;
    y: number;
    height: number;
    color: string;
}

export interface PlayersPerFrame {
    frameIdx: number;
    players: Array<Player>;
    football: Football;
}

export type Line = { x: number; y: number }[];
export type Lines = Line[];

export type Event = {
    time: number; // in seconds
    type: EventType;
};

export const GOALKEEPER = ['GK'];
export const DEFENDERS = ['DF', 'RB', 'RCB', 'CB', 'LCB', 'LB', 'RWB', 'LWB'];
export const MIDFIELDERS = ['MF', 'LM', 'RM', 'LDM', 'CDM', 'RDM', 'RCM', 'CM', 'LCM', 'RAM', 'LAM', 'AM'];
export const FORWARDS = ['FW', 'RW', 'LW', 'RST', 'LST', 'ST'];
export const SUBSTITUTES = ['SUB'];
