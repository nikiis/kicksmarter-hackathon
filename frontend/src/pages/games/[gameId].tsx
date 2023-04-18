import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import styles from '@styles/pages/PlayerPage.module.scss';
import { FC } from 'react';
import { useRouter } from 'next/router';
import PageHeader from '@/components/PageHeader/PageHeader';
import { GameProps } from '@/interfaces/pages/GameProps';
import client from '../../../apollo-client';
import { getGameQuery } from '@/queries/gameQuery';
import { convertUnixTimeToDate } from '@/helpers/helpers';

const PlayerPage: FC<GameProps> = ({ game, gameId }) => {
    const router = useRouter();

    const { home, away, description, startTime } = game;

    return (
        <section className={styles.playerPage}>
            <PageHeader>
                <div className={styles.heading}>
                    <h1>
                        <span style={{ color: home.jerseyColor }}>{home.name}</span>{' '}
                        <span>
                            {home.score} - {away.score}
                        </span>{' '}
                        <span style={{ color: away.jerseyColor }}>{away.name}</span>
                    </h1>
                    <p>{convertUnixTimeToDate(startTime)}</p>
                </div>
            </PageHeader>
            <div className={styles.container}>
                <h2>Analyse Match</h2>
                <PrimaryButton
                    label="Analyse Full Match"
                    customClass={styles.btn}
                    onClick={() => router.push(`/games/analysis/${gameId}`)}
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

    const { data: gameData } = await client.query({
        query: getGameQuery,
        variables: { id: gameId },
    });

    return {
        props: {
            gameId: gameId,
            game: gameData.game,
        },
    };
}
