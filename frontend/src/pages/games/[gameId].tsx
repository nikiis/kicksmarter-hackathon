import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import styles from '../styles/pages/PlayerPage.module.scss';

import GoalKeeper from '@/components/PlayerRole/GoalKeeper';
import Defender from '@/components/PlayerRole/Defender';
import MidField from '@/components/PlayerRole/MidField';
import Forward from '@/components/PlayerRole/Forward';
import HamburgerMenu from '@/components/HamburgerMenu/HamburgerMenu';
import { FC } from 'react';

const PlayerPage: FC<{ GameId: string }> = ({ GameId }) => {
    return (
        <section className={styles.playerPage}>
            <div className={styles.head}>
                <div className={styles.hamburger}>
                    <HamburgerMenu />
                </div>
                <div className={styles.heading}>
                    <h1>
                        Manchester City WFC <span>3 - 1</span> Tottenham Hotspur WFC
                    </h1>
                    <p>SUN, 05-MAR-2023, 14:01</p>
                </div>
            </div>
            <div className={styles.container}>
                <h2>Analyse Match</h2>
                <PrimaryButton label="Analyse Full Match" customClass={styles.btn} />
                <h2>Analyse Match Players</h2>
                <GoalKeeper />
                <Defender />
                <MidField />
                <Forward />
            </div>
        </section>
    );
};

export default PlayerPage;

export async function getServerSideProps(context: any) {
    const { params } = context;
    const { gameId } = params;

    return {
        props: {
            gameId: gameId,
        },
    };
}
