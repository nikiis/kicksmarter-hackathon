import { FC, useEffect, useState } from 'react';
import client from '../../../apollo-client';
import styles from '@/styles/pages/Game.module.scss';
import PitchDetails from '@/components/PitchDetails/PitchDetails';
import { GameProps } from '@/interfaces/pages/GameProps';
import { convertUnixTimeToDate } from '@/helpers/helpers';
import { getGameQuery } from '@/queries/gameQuery';
import { getFrameQuery } from '@/queries/frameQuery';
import { mapBallToFootball, mapFrameTeamToPlayers } from '@/helpers/mappers';
import { Period } from '@/interfaces/api/Period';
import { Football, Player, PlayersPerFrame } from '@/interfaces/global';

const Game: FC<GameProps> = ({ game, gameId }) => {
    const { home, away, startTime, pitchLength, pitchWidth } = game;

    const [players, setPlayers] = useState<Player[]>([]);
    const [football, setFootball] = useState<Football>({ x: 0, y: 0, height: 0, color: '' });
    const [currentGameTime, setCurrentGameTime] = useState(0);

    const totalGameTime =
        game.periods?.reduce(
            (accumulator: number, period: Period) => accumulator + period.stopGameClock - period.startGameClock,
            0
        ) ?? 90 * 60;
    // const fps = game.fps ?? 5;
    const fps = 5;

    useEffect(() => {
        const fetchFrame = async (clock: number) => {
            const queryResult = await client.query({
                query: getFrameQuery,
                variables: { id: gameId, clock: clock },
            });

            const frame = queryResult.data.frame;
            setPlayers(mapFrameTeamToPlayers(frame, home, away));
            setFootball(mapBallToFootball(frame, home, away));
        };

        // call the function
        fetchFrame(currentGameTime).catch(console.error);
    }, [away, currentGameTime, gameId, home]);

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
                    onGameTimeChange={(startTime: number, index?: number) => setCurrentGameTime(startTime)}
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

    return {
        props: {
            game: gameData.game,
            gameId: gameId,
        },
    };
}
