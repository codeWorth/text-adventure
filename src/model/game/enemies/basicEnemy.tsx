import Game from "../game";
import { Weapon, WeaponAction } from "../items/weapon";
import Enemy from "./enemy";

class BasicEnemy extends Enemy {

    constructor(name: string, maxHealth: number, maxStamina: number, weapon: Weapon) {
        super(name, maxHealth, maxStamina);
        this.mainHand = weapon;
    }

    decideAction(game: Game): WeaponAction {
        return WeaponAction.NORMAL_ATTACK;
    }
}

export default BasicEnemy;