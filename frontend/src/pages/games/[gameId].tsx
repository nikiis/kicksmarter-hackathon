import { FC, useEffect, useRef, useState } from 'react';
import client from '../../../apollo-client';
import styles from '@/styles/pages/Game.module.scss';
import PitchDetails from '@/components/PitchDetails/PitchDetails';
import { GameProps } from '@/interfaces/pages/GameProps';
import { convertUnixTimeToDate } from '@/helpers/helpers';
import { getGameQuery } from '@/queries/gameQuery';
import { getFrameQuery } from '@/queries/frameQuery';
import { mapBallToFootball, mapFrameTeamToPlayers } from '@/helpers/mappers';
import { Period } from '@/interfaces/api/Period';
import { Football, Player } from '@/interfaces/global';
import { useLazyQuery } from '@apollo/client/react/hooks/useLazyQuery';
import { getFramesQuery } from '@/queries/framesQuery';
import { Frame } from '@/interfaces/api/Frame';

const Game: FC<GameProps> = ({ game, gameId }) => {
    const { home, away, startTime, pitchLength, pitchWidth } = game;

    const [players, setPlayers] = useState<Player[]>([]);
    const [football, setFootball] = useState<Football>({ x: 0, y: 0, height: 0, color: '' });
    const [currentGameTime, setCurrentGameTime] = useState(0);
    const [period, setPeriod] = useState(game.periods?.at(0));
    const framesCache = useRef<Array<Frame>>([]);

    const fps = game.fps ?? 5;
    const PRECACHE_SECONDS = 8;
    const cachedFramesCount = PRECACHE_SECONDS * fps;

    const [cacheFrames, { loading }] = useLazyQuery(getFramesQuery, {
        client,
        onCompleted: (data) => {
            console.log(`Fetched Frames ${data.frames.at(0).frameIdx} to ${data.frames.at(-1).frameIdx} `);
            framesCache.current.push(...data.frames);
        },
    });

    const [renderSingle, {}] = useLazyQuery(getFrameQuery, {
        client,
        onCompleted: (data) => {
            const frame = data.frame;
            console.log('single rerender!');
            renderFrame(frame);
        },
    });

    const totalGameTime =
        game.periods?.reduce(
            (accumulator: number, period: Period) => accumulator + period.stopGameClock - period.startGameClock,
            0
        ) ?? 90 * 60;

    useEffect(() => {
        const frameIdx = Math.round(currentGameTime * fps);
        prefetchFrames(frameIdx, frameIdx + cachedFramesCount);
        renderSingle({ variables: { id: gameId, clock: currentGameTime } });
        console.log('initiating reloading...');
    }, [away, gameId, home, currentGameTime]);

    const prefetchFrames = (startFrameIdx: number, stopFrameIdx: number) => {
        cacheFrames({ variables: { id: gameId, startFrameIdx: startFrameIdx, stopFrameIdx: stopFrameIdx } });
    };

    const renderFrame = (frame: Frame) => {
        if (!frame) return;
        setPlayers(mapFrameTeamToPlayers(frame, home, away));
        setFootball(mapBallToFootball(frame, home, away));

        const clock = frame.gameClock ?? 0;
        const newPeriod = game.periods?.find((p) => clock < p.stopGameClock);
        setPeriod(newPeriod);
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
                    leftGoalColor={(period?.homeAttPositive ? home.jerseyColor : away.jerseyColor) ?? ''}
                    rightGoalColor={(period?.homeAttPositive ? away.jerseyColor : home.jerseyColor) ?? ''}
                    onGameTimeChange={(currTime: number, index?: number) => {
                        // manually shifted
                        if (index !== undefined) {
                            framesCache.current.length = 0;
                            setCurrentGameTime(currTime);
                            return;
                        }

                        const currFrame = framesCache.current.shift();
                        if (currFrame) renderFrame(currFrame);

                        const lastFrame = framesCache.current.at(-1);

                        if ((lastFrame?.gameClock ?? 0) < currTime + PRECACHE_SECONDS / 2) {
                            if (!loading) {
                                prefetchFrames(
                                    (lastFrame?.frameIdx ?? 0) + 1,
                                    (lastFrame?.frameIdx ?? 0) + cachedFramesCount
                                );
                            }
                        }
                    }}
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
