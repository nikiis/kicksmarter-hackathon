import { Event } from '../global';

export interface PlayerControlProps {
    totalGameTime: number; // in seconds
    fps: number;
    goalEvents?: Array<number>;
    onChangeCallback: (newTime: number, index?: number) => void;
    resetShadow: () => void;
    isLoading: boolean;
    controlRef: any;
}
