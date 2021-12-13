import Game from "../../game/game";
import ActionBuilder from "./actionBuilder";

class PureAction implements ActionBuilder {
    private readonly action: (game: Game) => void;

    constructor(action: (game: Game) => void) {
        this.action = action;
    }

    context() {
        return [];
    }

    apply(game: Game) {
        this.action(game);
    }

    terminal(): boolean {
        return true;
    }
}

export default PureAction;