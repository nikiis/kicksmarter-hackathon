import { FC } from 'react';
import styles from './MatchCard.module.scss';
import { MatchCardProps } from '@/interfaces/components/MatchCardProps';

const MatchCard: FC<MatchCardProps> = ({ date, type, homeTeam, awayTeam, altDisplay = false }) => {
    return (
        <div className={`${styles.matches} ${altDisplay && styles.altDisplay}`}>
            <div className={styles.dateTime}>
                <p>{date}</p>
                <span>{type}</span>
            </div>
            <div className={styles.teamScore}>
                <p style={{ color: homeTeam.jerseyColor }}>{homeTeam.name}</p>
                <p className={styles.scores}>
                    {homeTeam.score} - {awayTeam.score}
                </p>
                <p style={{ color: awayTeam.jerseyColor }}>{awayTeam.name}</p>
            </div>
        </div>
    );
};

export default MatchCard;
