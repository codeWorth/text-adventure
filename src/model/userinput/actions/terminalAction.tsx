import Game from "../../game/game";
import Option from "../option";
import ActionBuilder from "./actionBuilder";

abstract class TerminalAction implements ActionBuilder {

    abstract apply(game: Game): void;

    context(): Option[] {
        return [];
    }
    
    terminal(): boolean {
        return true;
    }

    usage(): string {
        return "";
    }
}

export default TerminalAction;