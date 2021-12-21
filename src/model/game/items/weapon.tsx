import Entity from "../entity";
import Game from "../game";
import Item from "./item"

enum WeaponType {
    LIGHT, NORMAL, HEAVY, OTHER
}

enum WeaponAction {
    NORMAL_ATTACK, BLOCK, LIGHT_ATTACK, PARRY, HEAVY_ATTACK, BASH, REST, NONE
}

enum EquipHand {
    ANY, MAIN, OFF, BOTH
}

const ATTACK_MAP = {
    [WeaponType.LIGHT]: WeaponAction.LIGHT_ATTACK,
    [WeaponType.NORMAL]: WeaponAction.NORMAL_ATTACK,
    [WeaponType.HEAVY]: WeaponAction.HEAVY_ATTACK,
    [WeaponType.OTHER]: WeaponAction.NONE
};

abstract class Weapon extends Item {

    public readonly type: WeaponType;
    public readonly hand: EquipHand;

    constructor(name: string, pickupNames: string[], type: WeaponType, hand: EquipHand) {
        super(name, pickupNames);
        this.type = type;
        this.hand = hand;
    }

    abstract attack(otherAction: WeaponAction, source: Entity, target: Entity, game: Game): void;
}

export { Weapon, WeaponType, WeaponAction, EquipHand, ATTACK_MAP };