import Game from "../../game";
import Option from "../option";
import ActionBuilder from "./actionBuilder";
import Direction from "../direction";

class BaseBuilder implements ActionBuilder {
    context(game: Game): Option[] {
        return [
            Option.forAction("go", new GoBuilder()),
            Option.forAction("look", new LookBuilder())
        ];
    }

    apply(game: Game) {
        game.error("THIS REALLY SHOULDN'T HAPPEN");
    }
}

class GoBuilder implements ActionBuilder {
    context(game: Game): Option[] {
        return [
            Option.forAction(" north", new GoFinished(Direction.NOTRTH)), 
            Option.forAction(" south", new GoFinished(Direction.SOUTH)), 
            Option.forAction(" east", new GoFinished(Direction.EAST)), 
            Option.forAction(" west", new GoFinished(Direction.WEST))
        ];
    }

    apply(game: Game) {
        game.error("You must specify the direction to go.");
    }
}

class GoFinished implements ActionBuilder {
    readonly direction: Direction;

    constructor(direction: Direction) {
        this.direction = direction;
    }

    context(game: Game): Option[] {
        return [];
    }

    apply(game: Game) {
        game.go(this.direction);
    }
}

class LookBuilder implements ActionBuilder {
    context(game: Game): Option[] {
        return [
            Option.forAction(" at", new LookAt())
        ];
    }

    apply(game: Game) {
        game.look();
    }
}

class LookAt implements ActionBuilder {
    context(game: Game): Option[] {
        return [];
    }

    apply(game: Game) {
        game.error("You must specify what to look at.");
    }
}

export { BaseBuilder, GoBuilder };