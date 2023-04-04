import { FC } from 'react';
import client from '../../../apollo-client';
import styles from '@/styles/pages/Game.module.scss';
import PitchDetails from '@/components/PitchDetails/PitchDetails';
import { GameProps } from '@/interfaces/pages/GameProps';
import { convertUnixTimeToDate } from '@/helpers/helpers';
import { getGameQuery } from '@/queries/gameQuery';
import { getFrameQuery } from '@/queries/frameQuery';
import { mapFrameTeamToPlayers } from '@/helpers/mappers';

const Game: FC<GameProps> = ({ game, frame }) => {
    const { home, away, startTime, pitchLength, pitchWidth } = game;
    const { homePlayers, awayPlayers, ball } = frame;

    const pitchScale = pitchWidth && pitchLength ? pitchLength / pitchWidth : 1.6;
    const players = mapFrameTeamToPlayers(frame, home, away);

    console.log(players);

    return (
        <div className={styles.game}>
            <div className={styles.container}>
                <div className={styles.info}>
                    <h1>
                        {home.name} {home.score} - {away.score} {away.name}
                    </h1>
                    <p>Date: {convertUnixTimeToDate(startTime)}</p>
                </div>

                <PitchDetails pitchScale={pitchScale} players={players} />
            </div>
        </div>
    );
};

export default Game;

export async function getServerSideProps(context: any) {
    const { params } = context;
    const { gameId } = params;

    const { data: gameData } = await client.query({
        query: getGameQuery,
        variables: { id: gameId },
    });

    const { data: frameData } = await client.query({
        query: getFrameQuery,
        variables: { id: gameId, clock: 0 },
    });

    return {
        props: {
            game: gameData.game,
            frame: frameData.frame,
        },
    };
}
