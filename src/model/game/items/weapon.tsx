import { assertUnreachable, requireOptional } from "../../../util";
import { CombatOption } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { Item, ItemParams } from "./item"

export type WeaponParams = {
    type: WeaponType,
    hand: EquipHand
};

export enum WeaponType {
    LIGHT = "Light", 
    NORMAL = "Normal",
    HEAVY = "Heavy",
    OTHER = "Other"
}

export enum TurnAction {
    NORMAL_ATTACK, BLOCK, LIGHT_ATTACK, PARRY, HEAVY_ATTACK, BASH, REST, PREPARE, NONE
}

// 0 goes first, then 1, then 2, etc
export function actionOrder(action: TurnAction): number {
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

export enum EquipHand {
    ANY = "Any hand", 
    MAIN = "Main hand only", 
    OFF = "Off hand only", 
    BOTH = "Two handed"
}

export abstract class Weapon extends Item {

    public readonly type: WeaponType;
    public readonly hand: EquipHand;

    constructor(itemParams: ItemParams, weaponParams: WeaponParams) {
        super(itemParams);
        this.type = weaponParams.type;
        this.hand = weaponParams.hand;
    }

    abstract options(player: Player): CombatOption[];
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

    static weaponBuilder(): WeaponBuilder {
        return new WeaponBuilder();
    }
}

class WeaponBuilder {
    private _type?: WeaponType;
    private _hand?: EquipHand;
    
    type(type: WeaponType): WeaponBuilder {
        this._type = type;
        return this;
    }

    hand(hand: EquipHand): WeaponBuilder {
        this._hand = hand;
        return this;
    }

    build(): WeaponParams {
        requireOptional(this._type);
        requireOptional(this._hand);
        return {
            type: this._type as WeaponType,
            hand: this._hand as EquipHand
        };
    }
}