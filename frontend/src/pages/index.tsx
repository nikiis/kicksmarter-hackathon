import SplashScreen from '@/components/SplashScreen/SplashScreen';
import SvgIcon from '@/components/SvgIcon/SvgIcon';
import styles from '@/styles/pages/Home.module.scss';
import { useState } from 'react';

export default function Home() {
    const [showSplashScreen, setShowSplashScreen] = useState(true);

    setTimeout(() => setShowSplashScreen(false), 4000);

    return (
        <>
            <div className={`${showSplashScreen ? styles.show : styles.hide} ${styles.splashScreen}`}>
                <SplashScreen />
            </div>
            <div className={styles.home}>
                <div className={styles.container}>
                    <div className={styles.inner}>
                        <SvgIcon svgName="logo" customClass={styles.logo} />
                    </div>
                </div>
            </div>
        </>
    );
}
