import { FC, useState } from 'react';
import styles from './DropDown.module.scss';
import SvgIcon from '../SvgIcon/SvgIcon';

const DropDown: FC<{ label: string; subLabel?: string; width?: string }> = ({ label, subLabel, width }) => {
    const [show, setShow] = useState(false);

    return (
        <button className={styles.dropdown} onClick={() => setShow(!show)}>
            <div className={styles.dropdownPlaceholder} style={{ minWidth: width }}>
                <p>
                    {label} {subLabel && <span>2022-2023</span>}
                </p>
                <SvgIcon svgName="arrow-down" customClass={`${styles.arrow} ${show ? styles.open : ''}`} />
            </div>
        </button>
    );
};

export default DropDown;
