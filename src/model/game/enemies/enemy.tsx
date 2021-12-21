import Entity from "../entity";
import Game from "../game";
import { TurnAction } from "../items/weapon";

abstract class Enemy extends Entity {
    abstract decideAction(game: Game): TurnAction;
    abstract executeTurn(playerAction: TurnAction, game: Game): void;

    rest(game: Game) {
        game.log(`${this.name} took a moment to rest.`);
        this.increaseStamina(2);
    }
}

export default Enemy;