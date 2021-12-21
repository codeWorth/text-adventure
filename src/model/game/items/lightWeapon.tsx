import { EquipHand, Weapon, TurnAction, WeaponType } from "./weapon";

abstract class LightWeapon extends Weapon {
    
    constructor(name: string, pickupNames: string[], hand?: EquipHand) {
        super(name, pickupNames, WeaponType.NORMAL, hand || EquipHand.ANY);
    }
}

export default LightWeapon;