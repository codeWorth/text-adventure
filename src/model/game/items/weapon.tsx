import { assertUnreachable } from "../../../util";
import { CombatOption } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import Item from "./item"

enum WeaponType {
    LIGHT = "Light", 
    NORMAL = "Normal",
    HEAVY = "Heavy",
    OTHER = "Other"
}

enum TurnAction {
    NORMAL_ATTACK, BLOCK, LIGHT_ATTACK, PARRY, HEAVY_ATTACK, BASH, REST, PREPARE, NONE
}

// 0 goes first, then 1, then 2, etc
function actionOrder(action: TurnAction): number {
    switch (action) {
        case TurnAction.NORMAL_ATTACK:
            return 2;
        case TurnAction.LIGHT_ATTACK:
            return 2;
        case TurnAction.HEAVY_ATTACK:
            return 2;
        case TurnAction.REST:
            return 3;
        case TurnAction.NONE:
            return 3;
        case TurnAction.BASH:
            return 1;
        case TurnAction.PARRY:
            return 0;
        case TurnAction.BLOCK:
            return 0;
        case TurnAction.PREPARE:
            return 3;
        default:
            assertUnreachable(action);
    }
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
    finishTurn(owner: Entity, game: Game): void {
        // no-op by default
    }

    protected doDirectAttack(damage: number, stamina: number, source: Entity, target: Entity, game: Game) {
        if (source.getStamina() >= stamina) {
            const outgoing = source.calculateOutgoingDamage(damage, target);
            const incoming = target.calculateIncomingDamage(outgoing, source, this);
            game.log(`${source.name} attacked ${target.name} for ${incoming} damage!`);
            target.setHealth(target.getHealth() - incoming);
        } else {
            game.log(`${source.name} was too tired to attack.`);
        }
    }
}

export { Weapon, WeaponType, TurnAction, EquipHand, actionOrder };