import Action from './action';
import Option from '../option';
import Game from '../game';

const NO_ACTION: Action = (game: Game) => {};

abstract class ActionBuilder {
    abstract context(game: Game): Option[];

    build(): Action {
        return NO_ACTION;
    }
}

export { ActionBuilder, NO_ACTION };