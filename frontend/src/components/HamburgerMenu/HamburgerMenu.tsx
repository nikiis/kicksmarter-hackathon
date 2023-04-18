import { FC, useState } from 'react';
import styles from './HamburgerMenu.module.scss';
import SvgIcon from '../SvgIcon/SvgIcon';
import SidePanel from '../SidePanel/SidePanel';
import { PanelSide } from '@/interfaces/enums/enums';
import { useRouter } from 'next/router';
import { HamburgerMenuProps } from '@/interfaces/components/HamburgerMenuProps';

const HamburgerMenu: FC<HamburgerMenuProps> = ({ customClass = '' }) => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const router = useRouter();

    const routeToHome = () => {
        setIsNavOpen(false);
        router.push('/');
    };

    const routeBack = () => {
        setIsNavOpen(false);
        router.back();
    };

    return (
        <>
            <button
                aria-label="open navigation menu"
                onClick={() => setIsNavOpen(true)}
                className={`${styles.btn} ${customClass}`}>
                <SvgIcon svgName="hamburger" customClass={styles.icon} />
            </button>
            <SidePanel
                isOpen={isNavOpen}
                onCloseCallback={() => setIsNavOpen(false)}
                showCloseButton={false}
                side={PanelSide.LEFT}
                customClass={styles.panel}
                backgroundColor="#3F6168">
                <button onClick={routeBack}>
                    <SvgIcon svgName="back" customClass={styles.linkIcon} />
                    Back
                </button>
                <button onClick={routeToHome}>
                    <SvgIcon svgName="home" customClass={styles.linkIcon} />
                    Home
                </button>
            </SidePanel>
        </>
    );
};

export default HamburgerMenu;
