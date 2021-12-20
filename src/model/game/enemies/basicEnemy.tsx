import Game from "../game";
import { Weapon, WeaponAction } from "../items/weapon";
import Enemy from "./enemy";

class BasicEnemy extends Enemy {

    constructor(name: string, maxHealth: number, maxStamina: number, weapon: Weapon) {
        super(name, maxHealth, maxStamina);
        this.mainHand = weapon;
    }

    decideAction(game: Game): WeaponAction {
        if (this.getStamina() > 0) {
            return WeaponAction.NORMAL_ATTACK;
        } else {
            return WeaponAction.REST;
        }
    }
}

export default BasicEnemy;