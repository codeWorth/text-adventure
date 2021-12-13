import Option from '../option';
import Game from '../../game/game';

interface ActionBuilder {
    context(): Option[];
    apply(game: Game): void;
    terminal(): boolean;
}

export default ActionBuilder;