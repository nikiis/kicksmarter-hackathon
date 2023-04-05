import { FC, useEffect, useState } from 'react';
import client from '../../../apollo-client';
import styles from '@/styles/pages/Game.module.scss';
import PitchDetails from '@/components/PitchDetails/PitchDetails';
import { GameProps } from '@/interfaces/pages/GameProps';
import { convertUnixTimeToDate } from '@/helpers/helpers';
import { getGameQuery } from '@/queries/gameQuery';
import { getFrameQuery } from '@/queries/frameQuery';
import { getFramesQuery } from '@/queries/framesQuery';
import { mapBallToFootball, mapFrameTeamToPlayers } from '@/helpers/mappers';
import { Period } from '@/interfaces/api/Period';
import { PlayersPerFrame } from '@/interfaces/global';

const Game: FC<GameProps> = ({ game, frame, gameId }) => {
    const { home, away, startTime, pitchLength, pitchWidth } = game;
    const { ball } = frame;

    const players = mapFrameTeamToPlayers(frame, home, away);
    const football = mapBallToFootball(ball);

    const totalGameTime =
        game.periods?.reduce(
            (accumulator: number, period: Period) => accumulator + period.stopGameClock - period.startGameClock,
            0
        ) ?? 90 * 60;
    // const fps = game.fps ?? 5;
    const fps = 1;

    const [playersPerFrame, setPlayersPerFrame] = useState<PlayersPerFrame[]>([]);

    useEffect(() => {
        const getFrames = async () => {
            const { data } = await client.query({
                query: getFramesQuery,
                variables: { id: gameId, startClock: 0, stopClock: 10 },
            });
        };
    });

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
