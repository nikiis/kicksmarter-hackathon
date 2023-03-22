import { FC } from 'react';
import { AvatarProps } from '@/interfaces/components/AvatarProps';
import Image from 'next/image'
import styles from './Avatar.module.scss';

const Avatar: FC<AvatarProps> = ({ imagePath, imageAlt, customClass = ''}) => {
	return (
        <div className={`${styles.avatar} ${customClass}`}>
            <Image src={imagePath} alt={imageAlt} fill quality={100}/>
        </div>
	);
};

export default Avatar;
