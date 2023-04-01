import { Event } from '../global';

export interface PlayerControlProps {
    totalGameTime: number; // in seconds
    events?: Array<Event>;
    onChangeCallback: (newTime: number, index: number) => void;
}
