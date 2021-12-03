import Option from '../option';
import Game from '../game';

interface ActionBuilder {
    context(game: Game): Option[];
    apply(game: Game): void;
}

export default ActionBuilder;