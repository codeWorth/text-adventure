import { CombatOption } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import Item from "./item"

enum WeaponType {
    LIGHT, NORMAL, HEAVY, OTHER
}

enum TurnAction {
    NORMAL_ATTACK, BLOCK, LIGHT_ATTACK, PARRY, HEAVY_ATTACK, BASH, REST, NONE
}

enum EquipHand {
    ANY = "Any hand", 
    MAIN = "Main hand only", 
    OFF = "Off hand only", 
    BOTH = "Two handed"
}

abstract class Weapon extends Item {

    public readonly type: WeaponType;
    public readonly hand: EquipHand;

    constructor(name: string, pickupNames: string[], type: WeaponType, hand: EquipHand) {
        super(name, pickupNames);
        this.type = type;
        this.hand = hand;
    }

    abstract options(player: Player): CombatOption[];

    abstract details(): string;

    protected doDirectAttack(damage: number, stamina: number, source: Entity, target: Entity, game: Game) {
        if (source.setStamina(source.getStamina() - stamina)) {
            game.log(`${source.name} attacked ${target.name} for ${damage} damage!`);
            target.setHealth(target.getHealth() - damage);
        } else if (source instanceof Player) {
            game.log("You are too tired to do that!");
        }
    }
}

export { Weapon, WeaponType, TurnAction, EquipHand };