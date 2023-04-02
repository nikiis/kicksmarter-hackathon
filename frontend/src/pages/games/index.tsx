import client from '../../../apollo-client';
import { FC } from 'react';
import { GamesProps } from '@/interfaces/pages/GamesProps';
import styles from '@styles/pages/Games.module.scss';
import { Game } from '@/interfaces/api/Game';
import Link from 'next/link';
import { getAllGamesQuery } from '@/queries/gameQuery';

const Games: FC<GamesProps> = ({ allGames }) => {
    const games = allGames.allGames;

    return (
        <section className={styles.games}>
            <div className={styles.container}>
                <h1>List of Games</h1>
                <ul>
                    {games.map((game: Game) => {
                        const { home, away, gameId, description } = game;
                        return (
                            <li key={`game-${gameId}`}>
                                <Link href={`/games/${gameId}`}>
                                    {home.name} - {away.name}
                                </Link>
                                <p>{description}</p>
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
