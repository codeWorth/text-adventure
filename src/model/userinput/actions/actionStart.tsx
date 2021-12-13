import Option from "../option";
import ActionBuilder from "./actionBuilder";
import Game from "../../game/game";

class ActionStart implements ActionBuilder {
    private readonly options: Option[];

    constructor(...options: Option[]) {
        this.options = options;
    }

    context(): Option[] {
        return this.options;
    }

    apply(game: Game) {
        game.error("Please enter a command.");
    }

    terminal(): boolean {
        return false;
    }
}

export default ActionStart;