import ActionBuilder from "./actionBuilder";
import Game from "../../game/game";
import Option from "../option";
import Direction from "../direction";

export class GoBuilder implements ActionBuilder {
    private readonly options: Option[];

    constructor(...directions: Direction[]) {
        this.options = Array.from(new Set(directions))
            .map(direction => Option.forName(" " + direction, new GoFinished(direction)));
    }

    context(): Option[] {
        return this.options;
    }

    apply(game: Game) {
        game.error("You must specify the direction to go.");
    }

    terminal(): boolean {
        return false;
    }
}

export class GoFinished implements ActionBuilder {
    readonly direction: Direction;

    constructor(direction: Direction) {
        this.direction = direction;
    }

    context(): Option[] {
        return [];
    }

    apply(game: Game) {
        game.go(this.direction);
    }

    terminal(): boolean {
        return true;
    }
}
