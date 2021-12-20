import { Weapon, WeaponType } from "./weapon";

abstract class NormalWeapon extends Weapon {
    
    constructor(name: string, pickupNames: string[]) {
        super(name, pickupNames, WeaponType.NORMAL);
    }

    canMainHand(): boolean {
        return true;
    }

    canOffHand(): boolean {
        return true;
    }
}

export default NormalWeapon;