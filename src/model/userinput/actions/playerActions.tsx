import Game from "../../game/game";
import Option from "../option";
import ActionBuilder from "./actionBuilder";

class PlayerAction implements ActionBuilder {
    context() {
        return [
            Option.forAction("inventory", new ViewInventory())
        ];
    }

    apply(game: Game) {
        game.error("Please enter a command");
    }

    terminal(): boolean {
        return false;
    }
}

class ViewInventory implements ActionBuilder {
    context() {
        return [];
    }

    apply(game: Game) {
        game.player.printInventory(game);
    }

    terminal(): boolean {
        return true;
    }
}

export default PlayerAction;