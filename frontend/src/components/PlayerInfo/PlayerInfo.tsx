import React, { FC } from 'react';
import styles from './PlayerInfo.module.scss';
import { PlayerInfoProps } from '@/interfaces/components/PlayerInfoProps';
import { splitName } from '@/helpers/helpers';

const PlayerInfo: FC<PlayerInfoProps> = ({ name, number, country, colour, secondaryColour }) => {
    const names = splitName(name);

    return (
        // Add a little bit of opacity to the background color to not name it that intense
        <div className={styles.playerWrapper} style={{ backgroundColor: `${colour}90` }}>
            <div className={styles.img}></div>
            <div className={styles.playerInfo}>
                <div className={styles.nameNumber}>
                    <p style={{ color: secondaryColour }}>{`${names.firstName.at(0)}. ${names.lastName}`}</p>
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
