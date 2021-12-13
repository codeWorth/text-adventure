import Game from "../../game/game";
import Option from "../option";
import ActionBuilder from "./actionBuilder";

class LogAction implements ActionBuilder {
    private readonly message: string;

    constructor(message: string) {
        this.message = message;
    }

    context(): Option[] {
        return [];
    }

    apply(game: Game) {
        game.log(this.message);
    }

    terminal(): boolean {
        return true;
    }
}

export default LogAction;