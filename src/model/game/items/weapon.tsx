import Entity from "../entity";
import Game from "../game";
import Item from "./item"

enum WeaponType {
    LIGHT, NORMAL, HEAVY, OTHER
}

enum WeaponAction {
    NORMAL_ATTACK, BLOCK, LIGHT_ATTACK, PARRY, HEAVY_ATTACK, BASH, REST, NONE
}

const ATTACK_MAP = {
    [WeaponType.LIGHT]: WeaponAction.LIGHT_ATTACK,
    [WeaponType.NORMAL]: WeaponAction.NORMAL_ATTACK,
    [WeaponType.HEAVY]: WeaponAction.HEAVY_ATTACK,
    [WeaponType.OTHER]: WeaponAction.NONE
};

abstract class Weapon extends Item {

    public readonly type: WeaponType;

    constructor(name: string, pickupNames: string[], type: WeaponType) {
        super(name, pickupNames);
        this.type = type;
    }

    canMainHand(): boolean {
        return false;
    }

    canOffHand(): boolean {
        return false;
    }

    abstract attack(otherAction: WeaponAction, source: Entity, target: Entity, game: Game): void;
}

export { Weapon, WeaponType, WeaponAction, ATTACK_MAP };