import PlayerPitch from '@/components/PlayerPitch/PlayerPitch';
import SvgIcon from '@/components/SvgIcon/SvgIcon';
import { players } from '@/data/players';
import { football } from '@/data/football';
import styles from '@/styles/pages/Home.module.scss';
import { ParentSize } from '@visx/responsive';

export default function Home() {
    return (
        <div className={styles.home}>
            <div className={styles.container}>
                <div className={styles.inner}>
                    <SvgIcon svgName="logo" customClass={styles.logo} />
                    <ParentSize>
                        {({ width, height }) => (
                            <PlayerPitch
                                parentWidth={width}
                                parentHeight={height}
                                players={players}
                                football={football}
                            />
                        )}
                    </ParentSize>
                </div>
            </div>
        </div>
    );
}
