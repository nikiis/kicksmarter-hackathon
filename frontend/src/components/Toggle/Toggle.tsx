import { FC, useState } from 'react';
import { ToggleProps } from '@/interfaces/components/ToggleProps';
import styles from './Toggle.module.scss';

const Toggle: FC<ToggleProps> = ({ label, id, onToggleChange }) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className={styles.toggleWrapper}>
            {label && <span className={styles.label}>{label}</span>}
            <label className={styles.input} htmlFor={id}>
                <input
                    type="checkbox"
                    id={id}
                    name={id}
                    onChange={() => {
                        onToggleChange(!isChecked);
                        setIsChecked(!isChecked);
                    }}
                />
                <span className={styles.toggle}></span>
            </label>
        </div>
    );
};

export default Toggle;
