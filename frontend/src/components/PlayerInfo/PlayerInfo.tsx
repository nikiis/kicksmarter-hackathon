import React, { FC } from 'react';
import styles from './PlayerInfo.module.scss';
import { PlayerInfoProps } from '@/interfaces/components/PlayerInfoProps';

const PlayerInfo: FC<PlayerInfoProps> = ({ name, number, country, colour, secondaryColour }) => {
    return (
        <div className={styles.playerWrapper} style={{ backgroundColor: colour }}>
            <div className={styles.img}></div>
            <div className={styles.playerInfo}>
                <div className={styles.nameNumber}>
                    <p style={{ color: secondaryColour }}>{name}</p>
                    <span style={{ color: secondaryColour }}>{number}</span>
                </div>
                <div className={styles.country}>
                    <p style={{ color: secondaryColour }}>{country}</p>
                </div>
            </div>
        </div>
    );
};

export default PlayerInfo;
