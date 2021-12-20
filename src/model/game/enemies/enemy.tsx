import Entity from "../entity";
import Game from "../game";
import { WeaponAction } from "../items/weapon";

abstract class Enemy extends Entity {
    abstract decideAction(game: Game): WeaponAction;
}

export default Enemy;