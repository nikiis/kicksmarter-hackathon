import client from '../../../apollo-client';
import { FC } from 'react';
import { GamesProps } from '@/interfaces/pages/GamesProps';
import styles from '@styles/pages/Games.module.scss';
import { Game } from '@/interfaces/api/Game';
import Link from 'next/link';
import { getAllGamesQuery } from '@/queries/gameQuery';
import HamburgerMenu from '@/components/HamburgerMenu/HamburgerMenu';
import DropDown from '@/components/DropDown/DropDown';
import PageHeader from '@/components/PageHeader/PageHeader';
import MatchCard from '@/components/MatchCard/MatchCard';
import { convertUnixTimeToDate, getTypeFromGameDescription } from '@/helpers/helpers';

const Games: FC<GamesProps> = ({ allGames }) => {
    const games = allGames.allGames;

    return (
        <section className={styles.games}>
            <PageHeader>
                <h1>Past Matches</h1>
            </PageHeader>
            <div className={styles.container}>
                <DropDown />
                <h2>March 2023</h2>
                <ul>
                    {games.map((game: Game) => {
                        const { home, away, gameId, description, startTime } = game;
                        return (
                            <li key={`game-${gameId}`}>
                                {/* <Link href={`/games/${gameId}`}>
                                    {home.name} - {away.name}
                                </Link>
                                <p>{description}</p> */}
                                <Link href={`/games/${gameId}`}>
                                    <MatchCard
                                        date={convertUnixTimeToDate(startTime)}
                                        type={getTypeFromGameDescription(game.description)}
                                        homeTeam={home}
                                        awayTeam={away}
                                    />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <h2>Febuary 2023</h2>
                <h2>January 2023</h2>
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
