import Entity from "../entity";
import Game from "../game";
import { WeaponAction } from "../items/weapon";

abstract class Enemy extends Entity {
    abstract decideAction(game: Game): WeaponAction;

    rest(game: Game) {
        game.log(`${this.name} took a moment to rest.`);
        this.increaseStamina(2);
    }
}

export default Enemy;