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
            return [
                Option.forName(" at",  this.lookAt),
                ...this.lookAt
                    ? this.lookAt.context()
                    : []
            ];
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

    usage(): string {
        return "(at) <target>";
    }
}

export default LookBuilder;