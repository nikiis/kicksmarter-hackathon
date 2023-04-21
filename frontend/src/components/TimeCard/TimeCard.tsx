import { FC } from 'react';
import styles from './TimeCard.module.scss';

const TimeCard: FC<{ time: string }> = ({ time }) => {
    return (
        <div className={styles.timecard}>
            <span>{time}</span>
        </div>
    );
};

export default TimeCard;
