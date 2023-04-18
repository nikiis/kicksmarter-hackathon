import { useState, FC } from 'react';
import SplashScreen from '@/components/SplashScreen/SplashScreen';
import styles from '@/styles/pages/Home.module.scss';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import SvgIcon from '@/components/SvgIcon/SvgIcon';
import client from '../../apollo-client';
import { getAllGamesQuery } from '@/queries/gameQuery';
import { GamesProps } from '@/interfaces/pages/GamesProps';
import MatchCard from '@/components/MatchCard/MatchCard';
import { convertUnixTimeToDate, getTypeFromGameDescription } from '@/helpers/helpers';
import { useRouter } from 'next/router';

const Home: FC<GamesProps> = ({ allGames }) => {
    const games = allGames.allGames;
    const [showSplashScreen, setShowSplashScreen] = useState(true);

    const router = useRouter();

    setTimeout(() => setShowSplashScreen(false), 4000);

    return (
        <>
            <div className={`${showSplashScreen ? styles.show : styles.hide} ${styles.splashScreen}`}>
                <SplashScreen />
            </div>
            <div className={styles.home}>
                <div className={styles.container}>
                    <main className={styles.pageHome}>
                        <h1 className={styles.heading}>Welcome Back</h1>
                        <div className={styles.homebutton}>
                            <PrimaryButton label="View Past Matches" onClick={() => router.push('/games')} />
                            <PrimaryButton label="Live Match Analysis" customClass={styles.btn} />
                        </div>
                        <div className={styles.recentMatches}>
                            <h2>Most Recent Matches</h2>

                            <div className={styles.matchesContainer}>
                                {games.map((game) => (
                                    <MatchCard
                                        key={`match-${game.gameId}`}
                                        awayTeam={game.away}
                                        homeTeam={game.home}
                                        date={convertUnixTimeToDate(game.startTime)}
                                        type={getTypeFromGameDescription(game.description)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.upcomingContainer}>
                            <SvgIcon svgName="live" customClass={styles.live} />
                            <div className={styles.upcoming}>
                                <p>Upcoming Match</p>
                                <p>Man City</p>
                            </div>
                        </div>
                        <div className={styles.logocontainer}>
                            <SvgIcon svgName="logo" customClass={styles.logo} />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export async function getStaticProps() {
    const { data } = await client.query({
        query: getAllGamesQuery,
    });

    return {
        props: {
            allGames: data,
        },
    };
}

export default Home;
