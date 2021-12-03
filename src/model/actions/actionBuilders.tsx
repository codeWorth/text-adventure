import Game from "../game";
import Option from "../option";
import { ActionBuilder } from "./actionBuilder";
import Action from './action';
import Direction from "../direction";

class BaseBuilder extends ActionBuilder {
    context(game: Game): Option[] {
        return [
            Option.forAction("go", new GoBuilder()),
            Option.forAction("look", new LookBuilder())
        ];
    }
}

class GoBuilder extends ActionBuilder {
    context(game: Game): Option[] {
        return [
            Option.forAction(" north", new GoFinished(Direction.NOTRTH)), 
            Option.forAction(" south", new GoFinished(Direction.SOUTH)), 
            Option.forAction(" east", new GoFinished(Direction.EAST)), 
            Option.forAction(" west", new GoFinished(Direction.WEST))
        ];
    }
}

class GoFinished extends ActionBuilder implements Action {
    readonly direction: Direction;

    constructor(direction: Direction) {
        super();
        this.direction = direction;
    }

    context(game: Game): Option[] {
        return [];
    }

    build(): Action {
        return this;
    }

    apply(game: Game) {
        game.go(this.direction);
    }
}

class LookBuilder extends ActionBuilder implements Action {
    context(game: Game): Option[] {
        return [];
    }

    apply(game: Game) {
        game.look();
    }
}

export { BaseBuilder, GoBuilder };