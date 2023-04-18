import { Frame } from '@/interfaces/api/Frame';
import { Team } from '@/interfaces/api/Team';
import { Football } from '@/interfaces/global';
import { Player } from '@/interfaces/global';

export const mapFrameTeamToPlayers = (frame: Frame, homeTeam: Team, awayTeam: Team): Array<Player> => {
    const players: Array<Player> = [
        ...frame.awayPlayers.map((awayPlayer) => {
            return {
                id: awayPlayer.optaId,
                playerNumber: awayPlayer.number,
                x: awayPlayer.xy ? awayPlayer.xy[0] : 0,
                y: awayPlayer.xy ? awayPlayer.xy[1] : 0,
                jerseyColor: awayTeam.jerseyColor ?? '#1A3966',
                secondaryColor: awayTeam.secondaryColor ?? '#000000',
                openness: awayPlayer.openness,
                position: awayTeam.players?.filter((i) => i.optaId === awayPlayer.optaId)[0].position,
            };
        }),
        ...frame.homePlayers.map((homePlayer) => {
            return {
                id: homePlayer.optaId,
                playerNumber: homePlayer.number,
                x: homePlayer.xy ? homePlayer.xy[0] : 0,
                y: homePlayer.xy ? homePlayer.xy[1] : 0,
                jerseyColor: homeTeam.jerseyColor ?? '#B3D7DF',
                secondaryColor: homeTeam.secondaryColor ?? '#000000',
                openness: homePlayer.openness,
                position: homeTeam.players?.filter((i) => i.optaId === homePlayer.optaId)[0].position,
            };
        }),
    ];

    return players;
};

export const mapBallToFootball = (frame: Frame, homeTeam: Team, awayTeam: Team): Football => {
    const { ball, lastTouch } = frame;
    const color = (lastTouch === 'home' ? homeTeam.jerseyColor : awayTeam.jerseyColor) ?? '#FFFFFF';
    return {
        x: ball.xyz[0],
        y: ball.xyz[1],
        height: ball.xyz[2],
        color: color,
    };
};

export const mapTeamToPlayerInfo = (homeTeam: Team, awayTeam: Team) => {
    const players =
        homeTeam.players && awayTeam.players
            ? [
                  ...homeTeam.players?.map((player) => {
                      return {
                          name: player.name,
                          number: player.number,
                          country: player.country,
                          colour: homeTeam.jerseyColor,
                          secondaryColour: homeTeam.secondaryColor,
                          team: homeTeam.name,
                          position: player.position,
                          id: player.optaId,
                      };
                  }),
                  ...awayTeam.players?.map((player) => {
                      return {
                          name: player.name,
                          number: player.number,
                          country: player.country,
                          colour: awayTeam.jerseyColor,
                          secondaryColour: awayTeam.secondaryColor,
                          team: awayTeam.name,
                          position: player.position,
                          id: player.optaId,
                      };
                  }),
              ]
            : [];

    return players;
};
