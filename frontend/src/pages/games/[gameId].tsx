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
import useAbortiveQuery from '@/hooks/useAbortiveQuery';

const Game: FC<GameProps> = ({ game, gameId }) => {
    const { home, away, startTime, pitchLength, pitchWidth } = game;

    const [players, setPlayers] = useState<Player[]>([]);
    const [football, setFootball] = useState<Football>({ x: 0, y: 0, height: 0, color: '' });
    const [period, setPeriod] = useState(game.periods?.at(0));
    const framesCache = useRef<Array<Frame>>([]);
    const framesArrived = useRef<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [prefetchFrameIdx, setPrefetchFrameIdx] = useState<number>(0);

    const fps = game.fps ?? 5;
    const PRECACHE_SECONDS = 10;
    const cachedFramesCount = Math.round(PRECACHE_SECONDS * fps);

    const { cancel } = useAbortiveQuery({
        client: client,
        query: getFramesQuery,
        variables: { id: gameId, startFrameIdx: prefetchFrameIdx, stopFrameIdx: prefetchFrameIdx + cachedFramesCount },
        deps: [away, gameId, home, prefetchFrameIdx],
        onCompleted: (data) => {
            setIsLoading(false);
            framesCache.current.push(...data.frames);
            console.log(
                `Fetched Frames ${data.frames.at(0).frameIdx} to ${data.frames.at(-1).frameIdx}. Cached ${
                    framesCache.current.length
                } frames.`
            );
            framesArrived.current = true;
        },
        fetchPolicy: 'network-only', // if we use cache-and-network, then returns two requests 1. cache, 2. network, but I only need one.
    });

    const [renderSingle] = useLazyQuery(getFrameQuery, {
        client,
        onCompleted: (data) => {
            const frame = data.frame;
            renderFrame(frame);
        },
    });

    const totalGameTime =
        game.periods?.reduce(
            (accumulator: number, period: Period) => accumulator + period.stopGameClock - period.startGameClock,
            0
        ) ?? 90 * 60;

    useEffect(() => {
        setIsLoading(true);
        renderSingle({ variables: { id: gameId, idx: prefetchFrameIdx } });
    }, [away, gameId, home, renderSingle]);

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
                    isLoading={isLoading}
                    football={football}
                    leftGoalColor={(period?.homeAttPositive ? home.jerseyColor : away.jerseyColor) ?? ''}
                    rightGoalColor={(period?.homeAttPositive ? away.jerseyColor : home.jerseyColor) ?? ''}
                    onGameTimeChange={(currTime: number, index?: number) => {
                        // manually shifted
                        if (index !== undefined) {
                            setIsLoading(true);
                            if (!framesArrived.current) cancel();
                            framesArrived.current = false;
                            framesCache.current.length = 0;
                            const frameIdx = Math.round(currTime * fps);
                            renderSingle({ variables: { id: gameId, idx: frameIdx } });
                            setPrefetchFrameIdx(frameIdx);
                            return;
                        }

                        // Use FrameIdx for everything, since gameClock is reset after each period
                        const currFrameIdx = Math.round(currTime * fps);

                        const currFrame = framesCache.current.shift();
                        if (currFrame) renderFrame(currFrame);

                        const lastFrame = framesCache.current.at(-1);
                        const lastFrameIdx = lastFrame?.frameIdx ?? 0;

                        if (lastFrameIdx < currFrameIdx + cachedFramesCount / 2) {
                            if (!framesArrived.current) return;

                            framesArrived.current = false;
                            console.log(`Prefeching frames ${lastFrameIdx + 1} to ${lastFrameIdx + cachedFramesCount}`);
                            setPrefetchFrameIdx(lastFrameIdx + 1);
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
