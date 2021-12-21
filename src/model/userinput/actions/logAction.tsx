import Game from "../../game/game";
import TerminalAction from "./terminalAction";

class LogAction extends TerminalAction {
    private readonly message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }

    apply(game: Game) {
        game.log(this.message);
    }
}

export default LogAction;