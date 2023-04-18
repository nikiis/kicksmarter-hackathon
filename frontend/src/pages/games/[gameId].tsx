import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import styles from '@styles/pages/PlayerPage.module.scss';
import { FC } from 'react';
import { useRouter } from 'next/router';
import PageHeader from '@/components/PageHeader/PageHeader';
import { GameProps } from '@/interfaces/pages/GameProps';
import client from '../../../apollo-client';
import { getGameQuery } from '@/queries/gameQuery';
import { convertUnixTimeToDate } from '@/helpers/helpers';
import PlayerInfo from '@/components/PlayerInfo/PlayerInfo';
import { DEFENDERS, FORWARDS, GOALKEEPER, MIDFIELDERS, SUBSTITUTES } from '@/interfaces/global';
import { mapTeamToPlayerInfo } from '@/helpers/mappers';

const PlayerPage: FC<GameProps> = ({ game, gameId }) => {
    const router = useRouter();

    const { home, away, startTime } = game;
    const players = mapTeamToPlayerInfo(home, away);

    const goalkeepers = players.filter((player) => GOALKEEPER.includes(player.position));
    const midfielders = players.filter((player) => MIDFIELDERS.includes(player.position));
    const defenders = players.filter((player) => DEFENDERS.includes(player.position));
    const forwards = players.filter((player) => FORWARDS.includes(player.position));
    const subs = players.filter((player) => SUBSTITUTES.includes(player.position));

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

                <div className={styles.playerSection}>
                    <h3 className={styles.goalie}>Goal Keepers</h3>
                    <div className={styles.players}>
                        {goalkeepers.map((player) => (
                            <PlayerInfo
                                key={`goalie-${player.id}`}
                                name={player.name}
                                number={player.number}
                                country={player.country}
                                colour={player.colour}
                                secondaryColour={player.secondaryColour}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.playerSection}>
                    <h3 className={styles.midfield}>Midfielders</h3>
                    <div className={styles.players}>
                        {midfielders.map((player) => (
                            <PlayerInfo
                                key={`midfield-${player.id}`}
                                name={player.name}
                                number={player.number}
                                country={player.country}
                                colour={player.colour}
                                secondaryColour={player.secondaryColour}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.playerSection}>
                    <h3 className={styles.defenders}>Defenders</h3>
                    <div className={styles.players}>
                        {defenders.map((player) => (
                            <PlayerInfo
                                key={`defender-${player.id}`}
                                name={player.name}
                                number={player.number}
                                country={player.country}
                                colour={player.colour}
                                secondaryColour={player.secondaryColour}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.playerSection}>
                    <h3 className={styles.forwards}>Forwards</h3>
                    <div className={styles.players}>
                        {forwards.map((player) => (
                            <PlayerInfo
                                key={`forward-${player.id}`}
                                name={player.name}
                                number={player.number}
                                country={player.country}
                                colour={player.colour}
                                secondaryColour={player.secondaryColour}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.playerSection}>
                    <h3 className={styles.subs}>Substitutes</h3>
                    <div className={styles.players}>
                        {subs.map((player) => (
                            <PlayerInfo
                                key={`sub-${player.id}`}
                                name={player.name}
                                number={player.number}
                                country={player.country}
                                colour={player.colour}
                                secondaryColour={player.secondaryColour}
                            />
                        ))}
                    </div>
                </div>
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
