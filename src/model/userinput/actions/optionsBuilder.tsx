import Option from "../option";
import ActionBuilder from "./actionBuilder";
import Game from "../../game/game";

class OptionsBuilder implements ActionBuilder {
    private readonly errorMessage: string;
    private readonly options: Option[];

    constructor(errorMessage: string, ...options: Option[]) {
        this.errorMessage = errorMessage;
        this.options = options;
    }

    context(): Option[] {
        return this.options;
    }

    apply(game: Game) {
        game.error(this.errorMessage);
    }

    terminal(): boolean {
        return false;
    }
}

export default OptionsBuilder;