import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import NormalWeapon from "./normalWeapon";
import { WeaponAction } from "./weapon";

class BasicNormalWeapon extends NormalWeapon {

    public damage: number;
    public stamina: number;

    constructor(name: string, pickupNames: string[], damage: number, stamina: number) {
        super(name, pickupNames);
        this.damage = damage;
        this.stamina = stamina;
    }

    attack(otherAction: WeaponAction, source: Entity, target: Entity, game: Game): void {
        if ([WeaponAction.LIGHT_ATTACK, WeaponAction.NORMAL_ATTACK, WeaponAction.HEAVY_ATTACK, WeaponAction.REST, WeaponAction.NONE].includes(otherAction)) {
            if (source.setStamina(source.getStamina() - this.stamina)) {
                game.log(`${source.name} attacked ${target.name} for ${this.damage} damage!`);
                target.setHealth(target.getHealth() - this.damage);
            } else if (source instanceof Player) {
                game.log("You are too tired to do that!");
            }
        } else {
            // :)
        }
    }
}

export default BasicNormalWeapon;