import { Player } from '../global';
import { MouseTouchOrPointerEvent } from '@visx/drag/lib/useDrag';

export interface PlayerPinProps {
    player: Player;
    dx: number;
    dy: number;
    isActive?: boolean;
    onMouseMove: (event: MouseTouchOrPointerEvent) => void;
    onMouseUp: (event: MouseTouchOrPointerEvent) => void;
    onMouseDown: (event: MouseTouchOrPointerEvent) => void;
    onTouchStart: (event: MouseTouchOrPointerEvent) => void;
    onTouchMove: (event: MouseTouchOrPointerEvent) => void;
    onTouchEnd: (event: MouseTouchOrPointerEvent) => void;
    getOpenness: (player: Player) => number;
    scale: number;
    isResetOpenness: boolean;
    resetShadows: () => void;
    onCreateNewShadow: (player: Player) => void;
}
