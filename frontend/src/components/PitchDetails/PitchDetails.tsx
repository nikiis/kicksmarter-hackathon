import { ParentSize } from '@visx/responsive';
import { FC, useState } from 'react';
import PlayerPitch from '../PlayerPitch/PlayerPitch';
// import { players } from '@/data/players';
import { football } from '@/data/football';
import SvgIcon from '../SvgIcon/SvgIcon';
import PlayerControl from '../PlayerControl/PlayerControl';
import styles from './PitchDetails.module.scss';
import { PitchDetailsProps } from '@/interfaces/components/PitchDetailsProps';

const PitchDetails: FC<PitchDetailsProps> = ({ players, originalHeight, originalWidth, totalGameTime, fps }) => {
    const [isDrawEnabled, setIsDrawEnabled] = useState(false);

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
                    onChangeCallback={(time, index) => console.log(time, index)}
                />
            </div>
        </section>
    );
};

export default PitchDetails;
