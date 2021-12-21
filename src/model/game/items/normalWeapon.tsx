import { EquipHand, Weapon, WeaponAction, WeaponType } from "./weapon";

abstract class NormalWeapon extends Weapon {
    
    constructor(name: string, pickupNames: string[], hand?: EquipHand) {
        super(name, pickupNames, WeaponType.NORMAL, hand || EquipHand.ANY);
    }

    canMainHand(): boolean {
        return true;
    }

    canOffHand(): boolean {
        return true;
    }

    canAttack(otherAction: WeaponAction): boolean {
        return [WeaponAction.LIGHT_ATTACK, WeaponAction.NORMAL_ATTACK, WeaponAction.HEAVY_ATTACK, WeaponAction.REST, WeaponAction.NONE].includes(otherAction);
    }
}

export default NormalWeapon;