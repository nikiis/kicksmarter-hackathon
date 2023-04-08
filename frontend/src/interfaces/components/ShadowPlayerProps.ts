import { MouseTouchOrPointerEvent } from '@visx/drag/lib/useDrag';
import { Player } from '../global';

export interface ShadowPlayerProps {
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
    isResetShadow: boolean;
    reInitialiseShadow: () => void;
}
