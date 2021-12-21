import Game from "../../game/game";
import TerminalAction from "./terminalAction";

class EmptyAction extends TerminalAction {
    apply(game: Game): void {
        // no-op
    }
}

export default EmptyAction;