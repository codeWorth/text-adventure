import ActionBuilder from "./actionBuilder";
import Game from "../../game/game";
import Option from "../option";

class LookBuilder implements ActionBuilder {
    private readonly message: string;
    private readonly lookAt?: ActionBuilder;

    constructor(message: string, lookAt?: ActionBuilder) {
        this.message = message;
        this.lookAt = lookAt;
    }

    context(): Option[] {
        if (this.lookAt) {
            return [Option.forName(" at",  this.lookAt)];
        } else {
            return [];
        }
    }

    apply(game: Game) {
        game.log(this.message);
    }

    terminal(): boolean {
        return true;
    }
}

export default LookBuilder;