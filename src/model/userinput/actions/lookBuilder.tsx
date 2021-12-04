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
            return [Option.forAction(" at",  this.lookAt)];
        } else {
            return [];
        }
    }

    apply(game: Game) {
        game.log(this.message);
    }
}

export default LookBuilder;