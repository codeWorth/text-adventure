import Game from "../../game/game";
import ActionBuilder from "./actionBuilder";

export class CombinedContextBuilder implements ActionBuilder {
    protected readonly actionBuilders: ActionBuilder[];

    constructor(applyAction: ActionBuilder, ...actionBuilders: ActionBuilder[]) {
        this.actionBuilders = [applyAction, ...actionBuilders];
    }

    context() {
        return this.actionBuilders.flatMap(action => action.context());
    }

    apply(game: Game) {
        this.actionBuilders[0].apply(game);
    }
}

export class CombinedApplyBuilder extends CombinedContextBuilder {
    apply(game: Game) {
        this.actionBuilders.forEach(action => action.apply(game));
    }
}