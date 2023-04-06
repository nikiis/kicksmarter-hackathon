import { Frame } from '@/interfaces/api/Frame';
import { Team } from '@/interfaces/api/Team';
import { Football } from '@/interfaces/global';
import { Player } from '@/interfaces/global';

export const mapFrameTeamToPlayers = (frame: Frame, homeTeam: Team, awayTeam: Team): Player[] => {
    const players = [
        ...frame.awayPlayers.map((awayPlayer) => {
            return {
                id: awayPlayer.optaId,
                playerNumber: awayPlayer.number,
                x: awayPlayer.xy ? awayPlayer.xy[0] : 0,
                y: awayPlayer.xy ? awayPlayer.xy[1] : 0,
                colour: awayTeam.color ?? '#1A3966',
                openness: awayPlayer.openness,
            };
        }),
        ...frame.homePlayers.map((homePlayer) => {
            return {
                id: homePlayer.optaId,
                playerNumber: homePlayer.number,
                x: homePlayer.xy ? homePlayer.xy[0] : 0,
                y: homePlayer.xy ? homePlayer.xy[1] : 0,
                colour: homeTeam.color ?? '#B3D7DF',
                openness: homePlayer.openness,
            };
        }),
    ];

    return players;
};

export const mapBallToFootball = (frame: Frame, homeTeam: Team, awayTeam: Team): Football => {
    const { ball, lastTouch } = frame;
    const color = (lastTouch === 'home' ? homeTeam.color : awayTeam.color) ?? '#FFFFFF';
    return {
        x: ball.xyz[0],
        y: ball.xyz[1],
        height: ball.xyz[2],
        color: color,
    };
};
