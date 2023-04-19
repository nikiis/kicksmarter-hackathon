import { AllEvents } from '../api/Event';
import { Frame } from '../api/Frame';
import { Game } from '../api/Game';

export interface GameProps {
    game: Game;
    frame: Frame;
    allEvents: AllEvents;
    gameId: string;
}
