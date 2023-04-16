import { FC } from 'react';
import styles from './EventCard.module.scss';
import { EventCardProps } from '@/interfaces/components/EventCardProps';

const EventCard: FC<EventCardProps> = ({ time, name, number, position, xGoals, jerseyColour, textColour }) => {
    return (
        <div className={styles.eventcard} style={{ borderColor: jerseyColour }}>
            <p className={styles.time}>{time}</p>
            <div className={styles.middle}>
                <p className={styles.player}>
                    {name}
                    <span style={{ backgroundColor: jerseyColour, color: textColour }}>{number}</span>
                </p>
            </div>
            <div className={styles.end}>
                <p>{position}</p>
                <p>xG = {xGoals}</p>
            </div>
        </div>
    );
};

export default EventCard;
