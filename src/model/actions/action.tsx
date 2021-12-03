import Game from '../game';

interface Action {
    apply(game: Game): void;
}

export default Action;