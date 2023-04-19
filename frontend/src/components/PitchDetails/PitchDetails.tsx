import { ParentSize } from '@visx/responsive';
import { FC, useState } from 'react';
import PlayerPitch from '../PlayerPitch/PlayerPitch';
import SvgIcon from '../SvgIcon/SvgIcon';
import PlayerControl from '../PlayerControl/PlayerControl';
import styles from './PitchDetails.module.scss';
import { PitchDetailsProps } from '@/interfaces/components/PitchDetailsProps';
import Toggle from '../Toggle/Toggle';

const PitchDetails: FC<PitchDetailsProps> = ({
    players,
    originalHeight,
    originalWidth,
    totalGameTime,
    fps,
    isLoading,
    football,
    leftGoalColor,
    rightGoalColor,
    onGameTimeChange,
    controlRef,
}) => {
    const [isDrawEnabled, setIsDrawEnabled] = useState(false);
    const [resetShadow, setResetShadow] = useState(false);
    const [isShowOpenness, setIsShowOpenness] = useState(false);
    const [isShowOriginalPosition, setIsShowOriginalPosition] = useState(true);

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
                                showShadowPlayer={isShowOriginalPosition}
                                showOpenness={isShowOpenness}
                            />
                        )}
                    </ParentSize>
                </div>
                <div className={styles.editBtns}>
                    <Toggle
                        label="Player Openness"
                        id="openness-input"
                        onToggleChange={(isChecked: boolean) => setIsShowOpenness(isChecked)}
                    />
                    <Toggle
                        label="Hide Original Position(s)"
                        id="hidePosition-input"
                        onToggleChange={(isChecked: boolean) => setIsShowOriginalPosition(!isChecked)}
                    />
                    <button onClick={() => setIsDrawEnabled(!isDrawEnabled)}>
                        {isDrawEnabled ? <SvgIcon svgName="pencil-selected" /> : <SvgIcon svgName="pencil" />}
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
                    isLoading={isLoading}
                    controlRef={controlRef}
                />
            </div>
        </section>
    );
};

export default PitchDetails;
