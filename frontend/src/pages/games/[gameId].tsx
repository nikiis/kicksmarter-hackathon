import { FC, useEffect, useState } from 'react';
import client from '../../../apollo-client';
import styles from '@/styles/pages/Game.module.scss';
import PitchDetails from '@/components/PitchDetails/PitchDetails';
import { GameProps } from '@/interfaces/pages/GameProps';
import { convertUnixTimeToDate } from '@/helpers/helpers';
import { getAllGamesQuery, getGameQuery } from '@/queries/gameQuery';
import { getFrameQuery } from '@/queries/frameQuery';
import { getFramesQuery } from '@/queries/framesQuery';
import { mapBallToFootball, mapFrameTeamToPlayers } from '@/helpers/mappers';
import { Period } from '@/interfaces/api/Period';
import { Football, Player, PlayersPerFrame } from '@/interfaces/global';
import { useLazyQuery, useQuery } from '@apollo/client';
import { print } from 'graphql';

const Game: FC<GameProps> = ({ game, frame, gameId }) => {
    const { home, away, startTime, pitchLength, pitchWidth } = game;
    const { ball } = frame;

    const [players, setPlayers] = useState<Player[]>(mapFrameTeamToPlayers(frame, home, away));
    const [football, setFoorball] = useState<Football>(mapBallToFootball(ball));
    const [startGameTime, setStartGameTime] = useState(0);
    const [stopGameTime, setStopGameTime] = useState(1);

    const totalGameTime =
        game.periods?.reduce(
            (accumulator: number, period: Period) => accumulator + period.stopGameClock - period.startGameClock,
            0
        ) ?? 90 * 60;
    // const fps = game.fps ?? 5;
    const fps = 5;

    const [playersPerFrame, setPlayersPerFrame] = useState<PlayersPerFrame[]>([]);

    // const { loading, error, data } = useQuery(getFrameQuery, {
    // variables: { id: gameId, clock: 0 },
    // });

    // const [getGames, { loading, error, data }] = useLazyQuery(getAllGamesQuery);

    const fetchFrames = async () => {
        return await client.query({
            query: getFramesQuery,
            variables: { id: gameId, startClock: startGameTime, stopClock: stopGameTime },
        });
    };

    const fetchFrame = async (clock: number) => {
        return await client.query({
            query: getFrameQuery,
            variables: { id: gameId, clock: clock },
        });
    };

    async function getFrame(clock: number) {
        const response = await fetch('http://localhost:4000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: print(getFrameQuery),
                variables: { id: gameId, clock: clock },
            }),
        });

        const { data, errors } = await response.json();
        if (errors) {
            throw new Error(`Failed to fetch games: ${errors[0].message}`);
        }

        return data.frame;
    }

    const handleTimeChange = async (currTime: number, index?: number) => {
        // todo when index is defined, need to flush the whole queue and refetch the whole data, since the slider was moved manually
        console.log('currTime: ', currTime);
        console.log('index: ', index);

        const frame1 = await getFrame(currTime);
        // console.log(frame);
        const { ball } = frame1;

        const newPlayers = mapFrameTeamToPlayers(frame1, home, away);
        setPlayers(newPlayers);
        setFoorball(mapBallToFootball(ball));

        // console.log(players);
    };

    return (
        <div className={styles.game}>
            <div className={styles.container}>
                <div className={styles.info}>
                    <h1>
                        {home.name} {home.score} - {away.score} {away.name}
                    </h1>
                    <p>Date: {convertUnixTimeToDate(startTime)}</p>
                </div>

                <PitchDetails
                    players={players}
                    originalHeight={pitchWidth}
                    originalWidth={pitchLength}
                    totalGameTime={totalGameTime}
                    fps={fps}
                    football={football}
                    onGameTimeChange={(startTime: number, index?: number) => handleTimeChange(startTime, index)}
                />
            </div>
        </div>
    );
};

export default Game;

export async function getServerSideProps(context: any) {
    const { params } = context;
    const { gameId } = params;

    const { data: gameData } = await client.query({
        query: getGameQuery,
        variables: { id: gameId },
    });

    const { data: frameData } = await client.query({
        query: getFrameQuery,
        variables: { id: gameId, clock: 0 },
    });

    return {
        props: {
            game: gameData.game,
            frame: frameData.frame,
            gameId: gameId,
        },
    };
}
