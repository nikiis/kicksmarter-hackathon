import client from '../../../apollo-client';
import { FC } from 'react';
import { GamesProps } from '@/interfaces/pages/GamesProps';
import styles from '@styles/pages/Games.module.scss';
import { Game } from '@/interfaces/api/Game';
import Link from 'next/link';
import { getAllGamesQuery } from '@/queries/gameQuery';
import DropDown from '@/components/DropDown/DropDown';
import PageHeader from '@/components/PageHeader/PageHeader';
import MatchCard from '@/components/MatchCard/MatchCard';
import { convertUnixTimeToDate, getMonthYearFromUnixTime, getTypeFromGameDescription } from '@/helpers/helpers';

const Games: FC<GamesProps> = ({ allGames }) => {
    const games = allGames.allGames;

    return (
        <section className={styles.games}>
            <PageHeader>
                <h1>Past Matches</h1>
            </PageHeader>
            <div className={styles.container}>
                <DropDown />

                <ul>
                    {games.map((game: Game) => {
                        const { home, away, gameId, description, startTime } = game;
                        return (
                            <li key={`game-${gameId}`}>
                                <h2>{getMonthYearFromUnixTime(startTime)}</h2>
                                <Link href={`/games/${gameId}`}>
                                    <MatchCard
                                        date={convertUnixTimeToDate(startTime)}
                                        type={getTypeFromGameDescription(description)}
                                        homeTeam={home}
                                        awayTeam={away}
                                        altDisplay={true}
                                    />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
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

export default Games;
