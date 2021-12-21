import Game from "../../game/game";
import Option from "../option";
import ActionBuilder from "./actionBuilder";

class EmptyAction implements ActionBuilder {
    context(): Option[] {
        return [];
    }

    apply(game: Game): void {
        // no-op
    }

    terminal(): boolean {
        return false;
    }
}

export default EmptyAction;