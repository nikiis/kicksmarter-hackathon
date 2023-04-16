import { FC, useState } from 'react';
import SvgIcon from '@/components/SvgIcon/SvgIcon';
import styles from './Accordion.module.scss';
import { AccordionProps } from '@/interfaces/components/AccordionProps';

const Accordion: FC<AccordionProps> = ({ headerLabel, children }) => {
    const [isExpand, setIsExpand] = useState(false);

    return (
        <>
            <button className={styles.header} onClick={() => setIsExpand(!isExpand)}>
                <h3>{headerLabel}</h3>
                <SvgIcon svgName="down-chevron" customClass={`${styles.arrow} ${isExpand && styles.rotate}`} />
            </button>
            <div className={`${styles.content} ${isExpand && styles.expand}`}>{children}</div>
        </>
    );
};

export default Accordion;
