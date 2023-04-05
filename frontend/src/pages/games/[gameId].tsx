import { FC } from 'react';
import client from '../../../apollo-client';
import styles from '@/styles/pages/Game.module.scss';
import PitchDetails from '@/components/PitchDetails/PitchDetails';
import { GameProps } from '@/interfaces/pages/GameProps';
import { convertUnixTimeToDate } from '@/helpers/helpers';
import { getGameQuery } from '@/queries/gameQuery';
import { getFrameQuery } from '@/queries/frameQuery';
import { getFramesQuery } from '@/queries/framesQuery';
import { mapFrameTeamToPlayers } from '@/helpers/mappers';
import { Period } from '@/interfaces/api/Period';

const Game: FC<GameProps> = ({ game, frame }) => {
    const { home, away, startTime, pitchLength, pitchWidth } = game;
    const { homePlayers, awayPlayers, ball } = frame;

    const players = mapFrameTeamToPlayers(frame, home, away);

    const totalGameTime =
        game.periods?.reduce(
            (accumulator: number, period: Period) => accumulator + period.endGameClock - period.startGameClock,
            0
        ) ?? 90 * 60;
    const fps = game.fps ?? 5;

    console.log(players);

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
        },
    };
}

export async function getFrames(context: any) {
    const { params } = context;
    const { gameId } = params;

    const { data: frames } = await client.query({
        query: getFramesQuery,
        variables: { id: gameId, startClock: 0, stopClock: 10 },
    });

    return { frames };
}
