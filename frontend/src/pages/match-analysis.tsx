import PitchDetails from '@/components/PitchDetails/PitchDetails';
import styles from '@/styles/pages/Home.module.scss';

export default function MatchAnalysis() {
    return (
        <div className={styles.home}>
            <div className={styles.container}>
                <PitchDetails />
            </div>
        </div>
    );
}
