import { PlayerColour } from '@/interfaces/enums/enums';
import { Player } from '@/interfaces/global';

export const players: Array<Player> = [
    {
        id: 1,
        playerNumber: 1,
        x: 200,
        y: 500,
        colour: PlayerColour.BLUE,
    },
    {
        id: 2,
        playerNumber: 2,
        x: 160,
        y: 80,
        colour: PlayerColour.BLUE,
    },
    {
        id: 3,
        playerNumber: 3,
        x: 100,
        y: 300,
        colour: PlayerColour.BLUE,
    },
    {
        id: 4,
        playerNumber: 4,
        x: 90,
        y: 40,
        colour: PlayerColour.BLUE,
    },
    {
        id: 5,
        playerNumber: 10,
        x: 520,
        y: 230,
        colour: PlayerColour.RED,
    },
];
