import Entity from "../entity";
import Game from "../game";
import { Item } from "../items/item";
import { TurnAction } from "../items/weapon";

abstract class Enemy extends Entity {

    private cachedTurnAction?: TurnAction;
    public readonly drops: Item[];

    constructor(name: string, maxHealth: number, maxStamina: number, drops?: Item[]) {
        super(name, maxHealth, maxStamina);
        this.drops = drops || [];
        this.addDeathListener(game => {
            const itemsStr = this.drops.map(item => `\t- ${item.name}`).join("\n");
            game.log(`${name} is defeated, and drops:\n${itemsStr}`);
            this.drops.forEach(item => game.getCurrentRoom().takeableItems.addKnownItem(item));
        });
    }

    protected abstract decideAction(game: Game): TurnAction;
    abstract executeTurn(playerAction: TurnAction, game: Game): void;

    turnAction(game: Game): TurnAction {
        if (this.cachedTurnAction === undefined) {
            if (this.stunned) {
                this.cachedTurnAction = TurnAction.NONE;
            } else {
                this.cachedTurnAction = this.decideAction(game);
            }
        }
        return this.cachedTurnAction;
    }

    rest(game: Game) {
        game.log(`${this.name} took a moment to rest.`);
        this.increaseStamina(2);
    }

    finishTurn(game: Game): void {
        super.finishTurn(game);
        this.cachedTurnAction = undefined;
    }
}

export default Enemy;