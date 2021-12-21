import Game from "../../game/game";
import ActionBuilder from "./actionBuilder";

export class CombinedContextBuilder implements ActionBuilder {
    protected readonly actionBuilders: ActionBuilder[];

    constructor(...actionBuilders: ActionBuilder[]) {
        console.assert(actionBuilders.length > 0);
        this.actionBuilders = [...actionBuilders];
    }

    context() {
        return this.actionBuilders.flatMap(action => action.context());
    }

    apply(game: Game) {
        game.error("Unknown command.");
    }

    terminal(): boolean {
        return false;
    }

    usage(): string {
        return "<command>";
    }
}

export class CombinedApplyBuilder extends CombinedContextBuilder {
    apply(game: Game) {
        this.actionBuilders.forEach(action => action.apply(game));
    }

    terminal(): boolean {
        return this.actionBuilders.some(action => action.terminal());
    }
}