import { FC, useImperativeHandle, useRef, useState } from 'react';
import styles from './PlayerControl.module.scss';
import SvgIcon from '../SvgIcon/SvgIcon';
import { PlayerControlProps } from '@/interfaces/components/PlayerControlProps';
import ReactSlider from 'react-slider';
import { toGameDisplayTime } from './helpers';
import LoadSpinner from '../LoadSpinner/LoadSpinner';

const PlayerControl: FC<PlayerControlProps> = ({
    totalGameTime,
    onChangeCallback,
    goalEvents,
    fps,
    resetShadow,
    isLoading,
    controlRef,
}) => {
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const gameClock = useRef<number>(0);
    const intervalRef = useRef<any>(null);

    useImperativeHandle(controlRef, () => ({
        pause() {
            pause();
        },
        play() {
            play();
        },
        stop() {
            stop();
        },
    }));

    const play = () => {
        setIsPlaying(true);
        resetShadow();
        const period = Math.round((1 / fps) * 1000); // in ms
        intervalRef.current = setInterval(() => {
            if (gameClock.current > totalGameTime) {
                pause();
                return;
            }
            updateWith(gameClock.current + period / 1000);
        }, period);
    };

    const pause = () => {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
    };

    const stop = () => {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
        resetShadow();
        updateWith(0, 0);
    };

    const updateWith = (newTime: number, index?: number) => {
        gameClock.current = newTime;
        onChangeCallback(newTime, index);
        setCurrentTime(newTime);
    };

    const processedGoalTimes = goalEvents?.map((time) => time + 40);

    return (
        <div className={styles.playerControl}>
            <div className={styles.controls}>
                {isPlaying ? (
                    <button onClick={pause} aria-label="pause">
                        <SvgIcon svgName="pause" customClass={styles.icon} />
                    </button>
                ) : (
                    <button onClick={play} aria-label="play" disabled={isLoading} className={styles.playButton}>
                        {isLoading && LoadSpinner()}
                        <SvgIcon svgName="play" customClass={`${styles.icon} ${isLoading && styles.disabled}`} />
                    </button>
                )}

                <button onClick={stop} aria-label="stop">
                    <SvgIcon svgName="stop" customClass={styles.icon} />
                </button>
            </div>

            <div className={styles.sliderWrapper}>
                <ReactSlider
                    markClassName={styles.playerMarker}
                    disabled={isPlaying}
                    value={gameClock.current}
                    className={styles.playerSlider}
                    thumbClassName={`${styles.sliderThumb} ${isPlaying && styles.disabled}`}
                    trackClassName={styles.sliderTrack}
                    max={totalGameTime}
                    marks={goalEvents ? processedGoalTimes : false}
                    onAfterChange={(time, index) => {
                        console.log(time);
                        resetShadow();
                        if (typeof time !== 'number') return;
                        updateWith(time, index);
                    }}
                />
                <span>
                    {toGameDisplayTime(currentTime)} / {toGameDisplayTime(totalGameTime)}
                </span>
            </div>
        </div>
    );
};

export default PlayerControl;
