import { Frame } from '@/interfaces/api/Frame';
import { Team } from '@/interfaces/api/Team';
import { Player } from '@/interfaces/global';

export const mapFrameTeamToPlayers = (frame: Frame, homeTeam: Team, awayTeam: Team): Player[] => {
    const players = [
        ...frame.homePlayers.map((homePlayer) => {
            return {
                id: homePlayer.optaId,
                playerNumber: homePlayer.number,
                x: homePlayer.xy ? homePlayer.xy[0] : 0,
                y: homePlayer.xy ? homePlayer.xy[1] : 0,
                colour: homeTeam.color ?? '#B3D7DF',
            };
        }),
        ...frame.awayPlayers.map((awayPlayer) => {
            return {
                id: awayPlayer.optaId,
                playerNumber: awayPlayer.number,
                x: awayPlayer.xy ? awayPlayer.xy[0] : 0,
                y: awayPlayer.xy ? awayPlayer.xy[1] : 0,
                colour: awayTeam.color ?? '#1A3966',
            };
        }),
    ];

    return players;
};
