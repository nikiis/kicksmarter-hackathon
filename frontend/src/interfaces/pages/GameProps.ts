import { Frame } from '../api/Frame';
import { Game } from '../api/Game';

export interface GameProps {
    game: Game;
    frame: Frame;
    gameId: string;
}
