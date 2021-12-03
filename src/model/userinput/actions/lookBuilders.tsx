import ActionBuilder from "./actionBuilder";
import Game from "../../game/game";
import Option from "../option";

export class LookBuilder implements ActionBuilder {
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

export class LookAt implements ActionBuilder {
    private readonly visibles: Option[];

    constructor(...visibles: Option[]) {
        this.visibles = visibles;
    }

    context(): Option[] {
        return this.visibles;
    }

    apply(game: Game) {
        game.error("You must specify what to look at.");
    }
}