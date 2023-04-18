import { FC, ReactNode } from 'react';
import styles from './PageHeader.module.scss';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';

const PageHeader: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className={styles.pageHeader}>
            <div className={styles.container}>
                <div className={styles.inner}>
                    <HamburgerMenu customClass={styles.hamburger} />
                    <div className={styles.title}>{children}</div>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
