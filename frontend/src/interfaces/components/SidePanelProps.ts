import { ReactNode } from 'react';
import { PanelSide } from '../enums/enums';

export interface SidePanelProps {
    isOpen: boolean;
    side?: PanelSide;
    showCloseButton?: boolean;
    onCloseCallback: () => void;
    backgroundColor?: string;
    customClass?: string;
    children?: ReactNode;
}
