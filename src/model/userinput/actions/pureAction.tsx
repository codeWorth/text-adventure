import Game from "../../game/game";
import TerminalAction from "./terminalAction";

class PureAction extends TerminalAction {
    private readonly action: (game: Game) => void;

    constructor(action: (game: Game) => void) {
        super();
        this.action = action;
    }

    apply(game: Game) {
        this.action(game);
    }
}

export default PureAction;