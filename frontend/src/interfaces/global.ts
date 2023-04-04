import { EventType } from './enums/enums';

export interface Player {
    id: string;
    playerNumber: number;
    x?: number;
    y?: number;
    colour: string;
}

export interface Coords {
    x: number;
    y: number;
}

export interface Football {
    x: number;
    y: number;
    height: number;
}

export type Line = { x: number; y: number }[];
export type Lines = Line[];

export type Event = {
    time: number; // in seconds
    type: EventType;
};
