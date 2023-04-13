import { FC, useImperativeHandle, useRef, useState } from 'react';
import styles from './PlayerControl.module.scss';
import SvgIcon from '../SvgIcon/SvgIcon';
import { PlayerControlProps } from '@/interfaces/components/PlayerControlProps';
import ReactSlider from 'react-slider';
import { toGameDisplayTime } from './helpers';

const PlayerControl: FC<PlayerControlProps> = ({
    totalGameTime,
    onChangeCallback,
    events,
    fps,
    resetShadow,
    isLoading,
    controlRef,
}) => {
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const gameClock = useRef<number>(0);
    const eventsTimeStamp = events?.map((x) => x.time);
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

    return (
        <div className={styles.playerControl}>
            <div>{isLoading && <p>Loading...</p>}</div>

            <div className={styles.controls}>
                {isPlaying ? (
                    <button onClick={pause} aria-label="pause">
                        <SvgIcon svgName="pause" customClass={styles.icon} />
                    </button>
                ) : (
                    <button onClick={play} aria-label="play" disabled={isLoading}>
                        <SvgIcon svgName="play" customClass={`${styles.icon} ${isLoading && styles.disabled}`} />
                    </button>
                )}

                <button onClick={stop} aria-label="stop">
                    <SvgIcon svgName="stop" customClass={styles.icon} />
                </button>
            </div>

            <div className={styles.sliderWrapper}>
                <ReactSlider
                    disabled={isPlaying}
                    value={gameClock.current}
                    className={styles.playerSlider}
                    thumbClassName={`${styles.sliderThumb} ${isPlaying && styles.disabled}`}
                    trackClassName={styles.sliderTrack}
                    max={totalGameTime}
                    marks={events ? eventsTimeStamp : false}
                    onAfterChange={(time, index) => {
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
