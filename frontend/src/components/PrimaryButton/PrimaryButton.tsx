import { FC } from 'react';
import { PrimaryButtonProps } from '@/interfaces/components/PrimaryButtonProps';
import SvgIcon from '@/components/SvgIcon/SvgIcon';
import styles from './PrimaryButton.module.scss';

const PrimaryButton: FC<PrimaryButtonProps> = ({ label, svgName, customClass = '', onClick }) => {
    return (
        <button className={`${customClass} ${styles.primaryButton}`} onClick={onClick}>
            {label}
            {svgName && <SvgIcon svgName={svgName} customClass={styles.svg} />}
        </button>
    );
};

export default PrimaryButton;
