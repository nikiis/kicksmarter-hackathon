import SvgIcon from '@/components/SvgIcon/SvgIcon';
import styles from '@/styles/pages/Home.module.scss';

export default function Home() {
    return (
        <div className={styles.home}>
            <div className={styles.container}>
                <div className={styles.inner}>
                    <SvgIcon svgName="logo" customClass={styles.logo} />
                </div>
            </div>
        </div>
    );
}
