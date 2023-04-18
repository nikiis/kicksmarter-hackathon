import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import styles from '@styles/pages/PlayerPage.module.scss';
import HamburgerMenu from '@/components/HamburgerMenu/HamburgerMenu';
import { FC } from 'react';
import { useRouter } from 'next/router';

const PlayerPage: FC<{ gameId: { gameId: string } }> = (gameId) => {
    const router = useRouter();

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
                <PrimaryButton
                    label="Analyse Full Match"
                    customClass={styles.btn}
                    onClick={() => router.push(`/games/analysis/${gameId.gameId}`)}
                />
                <h2>Analyse Match Players</h2>
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
