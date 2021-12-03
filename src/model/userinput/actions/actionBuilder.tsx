import Option from '../option';
import Game from '../../game/game';

interface ActionBuilder {
    context(): Option[];
    apply(game: Game): void;
}

export default ActionBuilder;