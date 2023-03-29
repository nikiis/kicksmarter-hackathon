import { MouseTouchOrPointerEvent } from '@visx/drag/lib/useDrag';
import { Player } from '../global';

export interface PlayerPinProps {
    player: Player;
    dx: number;
    dy: number;
    isActive?: boolean;
    onMouseMove?: (event: MouseTouchOrPointerEvent) => void;
    onMouseUp?: (event: MouseTouchOrPointerEvent) => void;
    onMouseDown?: (event: MouseTouchOrPointerEvent) => void;
    onTouchStart?: (event: MouseTouchOrPointerEvent) => void;
    onTouchMove?: (event: MouseTouchOrPointerEvent) => void;
    onTouchEnd?: (event: MouseTouchOrPointerEvent) => void;
    scale: number;
}
