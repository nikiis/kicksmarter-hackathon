import { FC } from 'react';
import styles from './MatchCard.module.scss';
import { MatchCardProps } from '@/interfaces/components/MatchCardProps';

const MatchCard: FC<MatchCardProps> = ({ date, type, homeTeam, awayTeam }) => {
    return (
        <div className={styles.matches}>
            <div className={styles.dateTime}>
                <p>{date}</p>
                <span>{type}</span>
            </div>
            <div className={styles.teamScore}>
                <p>{homeTeam.name}</p>
                <p className={styles.scores}>
                    {homeTeam.score} - {awayTeam.score}
                </p>
                <p>{awayTeam.name}</p>
            </div>
        </div>
    );
};

export default MatchCard;
