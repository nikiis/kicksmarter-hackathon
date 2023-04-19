import { FC, useEffect, useRef, useState } from 'react';
import client from '../../../../apollo-client';
import styles from '@/styles/pages/Game.module.scss';
import PitchDetails from '@/components/PitchDetails/PitchDetails';
import { GameProps } from '@/interfaces/pages/GameProps';
import { convertSecondsToHHmm, convertUnixTimeToDate } from '@/helpers/helpers';
import { getGameQuery } from '@/queries/gameQuery';
import { getFrameQuery } from '@/queries/frameQuery';
import { mapBallToFootball, mapFrameTeamToPlayers } from '@/helpers/mappers';
import { Period } from '@/interfaces/api/Period';
import { Football, Player } from '@/interfaces/global';
import { useLazyQuery } from '@apollo/client/react/hooks/useLazyQuery';
import { getFramesQuery } from '@/queries/framesQuery';
import { Frame } from '@/interfaces/api/Frame';
import useAbortiveQuery from '@/hooks/useAbortiveQuery';
import SidePanel from '@/components/SidePanel/SidePanel';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import Accordion from '@/components/Accordion/Accordion';
import EventCard from '@/components/EventCard/EventCard';
import HamburgerMenu from '@/components/HamburgerMenu/HamburgerMenu';
import { getAllEventsQuery } from '@/queries/EventQuery';
import DropDown from '@/components/DropDown/DropDown';

const Game: FC<GameProps> = ({ game, gameId, allEvents }) => {
    const { home, away, startTime, pitchLength, pitchWidth, description, league } = game;

    const [players, setPlayers] = useState<Player[]>([]);
    const [football, setFootball] = useState<Football>({ x: 0, y: 0, height: 0, color: '' });
    const [period, setPeriod] = useState<Period | undefined>(game.periods?.at(0));
    const framesCache = useRef<Array<Frame>>([]);
    const framesArrived = useRef<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [prefetchFrameIdx, setPrefetchFrameIdx] = useState<number>(0);
    const shouldPlayAfterFetch = useRef<boolean>(false);
    const controlRef = useRef<any>(null);

    const fps = game.fps ?? 5;
    const PRECACHE_SECONDS = 10;
    const cachedFramesCount = Math.round(PRECACHE_SECONDS * fps);

    const { cancel } = useAbortiveQuery({
        client: client,
        query: getFramesQuery,
        variables: { id: gameId, startFrameIdx: prefetchFrameIdx, stopFrameIdx: prefetchFrameIdx + cachedFramesCount },
        deps: [gameId, prefetchFrameIdx],
        onCompleted: (data) => {
            framesCache.current.push(...data.frames);
            console.log(
                `Fetched FrameIdx ${data.frames.at(0)?.frameIdx ?? -1} to ${
                    data.frames.at(-1)?.frameIdx ?? -1
                }. Cached ${framesCache.current.length} frames.`
            );
            setIsLoading(false);
            framesArrived.current = true;
            if (shouldPlayAfterFetch.current) {
                shouldPlayAfterFetch.current = false;
                controlRef?.current?.play();
            }
        },
        fetchPolicy: 'network-only', // if we use cache-and-network, then returns two requests 1. cache, 2. network, but I only need one.
    });

    const [renderSingle] = useLazyQuery(getFrameQuery, {
        client,
        onCompleted: (data) => {
            const frame = data.frame;
            console.log(`fetched frameIdx ${frame?.frameIdx}.`);
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
        renderSingle({ variables: { id: gameId, idx: 0 } });
    }, [gameId, renderSingle]);

    const renderFrame = (frame: Frame) => {
        if (!frame) return;
        setPlayers(mapFrameTeamToPlayers(frame, home, away));
        setFootball(mapBallToFootball(frame, home, away));

        const frameIdx = frame.frameIdx ?? 0;
        const newPeriod = game.periods?.find((p) => frameIdx <= p.stopFrameIdx);
        setPeriod(newPeriod);
    };

    const [showPanel, setShowPanel] = useState(false);

    const goalEvents = allEvents.goals;
    const shotEvents = allEvents.shots;
    const progressivePassesEvents = allEvents.progressivePasses;
    const progressiveCarriesEvents = allEvents.progressiveCarries;
    const keyPasses = allEvents.keyPasses;

    return (
        <div className={styles.game}>
            <HamburgerMenu />
            <div className={styles.container}>
                <div className={styles.info}>
                    <PrimaryButton
                        onClick={() => setShowPanel(true)}
                        label="View events"
                        customClass={styles.eventsBtn}
                    />
                    <SidePanel isOpen={showPanel} onCloseCallback={() => setShowPanel(false)}>
                        <div className={styles.dropdown}>
                            <DropDown label="All events" width="200px" />
                        </div>

                        <div className={styles.accordion}>
                            <Accordion headerLabel="Goals">
                                {goalEvents.map((goal, index) => (
                                    <EventCard
                                        key={`goalevent-${index}`}
                                        time={convertSecondsToHHmm(goal.gameClock)}
                                        name={goal.player.name}
                                        jerseyColour={goal.team.jerseyColor}
                                        number={goal.player.number}
                                        position={goal.player.position}
                                        textColour={goal.team.secondaryColor}
                                        xGoals={goal.xG}
                                    />
                                ))}
                            </Accordion>
                            <Accordion headerLabel="Shots">
                                {shotEvents.map((shot, index) => (
                                    <EventCard
                                        key={`shotevents-${index}`}
                                        time={convertSecondsToHHmm(shot.gameClock)}
                                        name={shot.player.name}
                                        jerseyColour={shot.team.jerseyColor}
                                        number={shot.player.number}
                                        position={shot.player.position}
                                        textColour={shot.team.secondaryColor}
                                        xGoals={shot.xG}
                                    />
                                ))}
                            </Accordion>
                            <Accordion headerLabel="Progressive Passes">
                                {progressivePassesEvents.map((progressivePass, index) => (
                                    <EventCard
                                        key={`progressPassevents-${index}`}
                                        time={convertSecondsToHHmm(progressivePass.gameClock)}
                                        name={progressivePass.player.name}
                                        jerseyColour={progressivePass.team.jerseyColor}
                                        number={progressivePass.player.number}
                                        position={progressivePass.player.position}
                                        textColour={progressivePass.team.secondaryColor}
                                        length={progressivePass.length}
                                    />
                                ))}
                            </Accordion>
                            <Accordion headerLabel="Progressive Carries">
                                {progressiveCarriesEvents.map((progressiveCarry, index) => (
                                    <EventCard
                                        key={`progressCarryevents-${index}`}
                                        time={convertSecondsToHHmm(progressiveCarry.gameClock)}
                                        name={progressiveCarry.player.name}
                                        jerseyColour={progressiveCarry.team.jerseyColor}
                                        number={progressiveCarry.player.number}
                                        position={progressiveCarry.player.position}
                                        textColour={progressiveCarry.team.secondaryColor}
                                        length={progressiveCarry.length}
                                    />
                                ))}
                            </Accordion>
                            <Accordion headerLabel="Key Passes">
                                {keyPasses.map((keypass, index) => (
                                    <EventCard
                                        key={`keyPass-${index}`}
                                        time={convertSecondsToHHmm(keypass.gameClock)}
                                        name={keypass.player.name}
                                        jerseyColour={keypass.team.jerseyColor}
                                        number={keypass.player.number}
                                        position={keypass.player.position}
                                        textColour={keypass.team.secondaryColor}
                                        length={keyPasses.length}
                                    />
                                ))}
                            </Accordion>
                        </div>
                    </SidePanel>
                    <h1>
                        <span style={{ color: home.jerseyColor }}>{home.name} </span>
                        <span className={styles.score}>
                            {home.score} - {away.score} {''}
                        </span>
                        <span style={{ color: away.jerseyColor }}>{away.name}</span>
                    </h1>
                    <p className={styles.date}>
                        {convertUnixTimeToDate(startTime)} <span className={styles.type}>{league}</span>
                    </p>
                </div>

                <PitchDetails
                    players={players}
                    originalHeight={pitchWidth}
                    originalWidth={pitchLength}
                    totalGameTime={totalGameTime}
                    fps={fps}
                    isLoading={isLoading}
                    football={football}
                    // this is reversed, since this is what is given to us
                    leftGoalColor={(period?.homeAttPositive ? home.jerseyColor : away.jerseyColor) ?? ''}
                    rightGoalColor={(period?.homeAttPositive ? away.jerseyColor : home.jerseyColor) ?? ''}
                    controlRef={controlRef}
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
                        if (!currFrame) {
                            setIsLoading(true);
                            controlRef?.current?.pause();
                            shouldPlayAfterFetch.current = true;
                            console.log('Whoops, ran out, but should continue playing...');
                            return;
                        }
                        renderFrame(currFrame);

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

    const { data: allEventsData } = await client.query({
        query: getAllEventsQuery,
        variables: { gameId: gameId },
    });

    return {
        props: {
            game: gameData.game,
            allEvents: allEventsData.allEvents,
            gameId: gameId,
        },
    };
}
