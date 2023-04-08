import { ParentSize } from '@visx/responsive';
import { FC, useState } from 'react';
import PlayerPitch from '../PlayerPitch/PlayerPitch';
import SvgIcon from '../SvgIcon/SvgIcon';
import PlayerControl from '../PlayerControl/PlayerControl';
import styles from './PitchDetails.module.scss';
import { PitchDetailsProps } from '@/interfaces/components/PitchDetailsProps';

const PitchDetails: FC<PitchDetailsProps> = ({
    players,
    originalHeight,
    originalWidth,
    totalGameTime,
    fps,
    football,
    leftGoalColor,
    rightGoalColor,
    onGameTimeChange,
}) => {
    const [isDrawEnabled, setIsDrawEnabled] = useState(false);
    const [resetShadow, setResetShadow] = useState(false);

    return (
        <section className={styles.pitchDetails}>
            <div className={styles.row}>
                <div className={styles.pitch}>
                    <ParentSize>
                        {({ width, height }) => (
                            <PlayerPitch
                                parentWidth={width}
                                parentHeight={height}
                                players={players}
                                football={football}
                                isDrawEnabled={isDrawEnabled}
                                originalHeight={originalHeight}
                                originalWidth={originalWidth}
                                leftGoalColor={leftGoalColor}
                                rightGoalColor={rightGoalColor}
                                isResetOpenness={resetShadow}
                                reInitialiseOpenness={() => setResetShadow(false)}
                            />
                        )}
                    </ParentSize>
                </div>
                <div className={styles.editBtns}>
                    <button onClick={() => setIsDrawEnabled(true)} className={`${isDrawEnabled && styles.active}`}>
                        <SvgIcon svgName="pencil" />
                    </button>

                    <button onClick={() => setIsDrawEnabled(false)}>
                        <SvgIcon svgName="eraser" />
                    </button>
                </div>
            </div>
            <div className={styles.controls}>
                <PlayerControl
                    fps={fps}
                    totalGameTime={totalGameTime}
                    onChangeCallback={(time, index) => onGameTimeChange(time, index)}
                    resetShadow={() => setResetShadow(true)}
                />
            </div>
        </section>
    );
};

export default PitchDetails;
