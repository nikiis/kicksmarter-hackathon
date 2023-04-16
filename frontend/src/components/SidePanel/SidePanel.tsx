import { FC, useEffect, useRef, useState } from 'react';
import styles from './SidePanel.module.scss';
import { SidePanelProps } from '@/interfaces/components/SidePanelProps';
import { PanelSide } from '@/interfaces/enums/enums';
import SvgIcon from '../SvgIcon/SvgIcon';
import { createPortal } from 'react-dom';

const SidePanel: FC<SidePanelProps> = ({
    isOpen,
    side = PanelSide.RIGHT,
    onCloseCallback,
    showCloseButton = true,
    backgroundColor = '#EEE9E9',
    customClass,
    children,
}) => {
    const [mounted, setMounted] = useState(false);
    const bodyRef = useRef<Element | null>(null);
    const sidepanelRef = useRef<any>(null);

    useEffect(() => {
        setMounted(true);
        bodyRef.current = document.querySelector<HTMLElement>('body');

        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            bodyRef.current?.classList.add('addOverlay');
            return;
        }

        bodyRef.current?.classList.remove('addOverlay');
    }, [isOpen]);

    // close panel if user clicks outside the panel
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (sidepanelRef.current && !sidepanelRef.current.contains(event.target)) {
                onCloseCallback();
            }
        }
        if (isOpen) {
            // Bind the event listener
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidepanelRef, isOpen]);

    return mounted && bodyRef.current ? (
        <>
            {createPortal(
                <div
                    ref={sidepanelRef}
                    className={`${styles.sidePanel} ${isOpen && styles.active} ${
                        side === PanelSide.RIGHT ? styles.right : styles.left
                    } ${customClass && customClass}`}
                    style={{ backgroundColor: backgroundColor }}>
                    <div className={styles.content}>
                        {showCloseButton && (
                            <button aria-label="close side panel" className={styles.closeBtn} onClick={onCloseCallback}>
                                <SvgIcon svgName="right-chevron" customClass={styles.icon} />
                            </button>
                        )}
                        {children}
                    </div>
                </div>,
                bodyRef.current
            )}
        </>
    ) : null;
};

export default SidePanel;
