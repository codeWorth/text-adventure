import { assertUnreachable } from "../../../util";
import Entity from "../entity";
import Game from "../game";
import NormalWeapon from "./normalWeapon";
import { EquipHand, TurnAction } from "./weapon";

class BasicNormalWeapon extends NormalWeapon {

    private readonly damage: number;

    constructor(name: string, pickupNames: string[], damage: number, stamina: number, hand?: EquipHand) {
        super(name, pickupNames, stamina, hand || EquipHand.ANY);
        this.damage = damage;
    }

    details(): string {
        return `Damage: ${this.damage}
Stamina usage: ${this.stamina}
Type: ${this.type}
Equip slot: ${this.hand}`;
    }

    attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void {
        switch (targetAction) {
            case TurnAction.NORMAL_ATTACK:
                this.doDirectAttack(this.damage, this.stamina, source, target, game);
                break;
            case TurnAction.LIGHT_ATTACK:
                this.doDirectAttack(this.damage, this.stamina, source, target, game);
                break;
            case TurnAction.HEAVY_ATTACK:
                this.doDirectAttack(this.damage, this.stamina, source, target, game);
                break;
            case TurnAction.REST:
                this.doDirectAttack(this.damage, this.stamina, source, target, game);
                break;
            case TurnAction.NONE:
                this.doDirectAttack(this.damage, this.stamina, source, target, game);
                break;
            case TurnAction.BASH:
                if (target.isBlocking(source)) {
                    this.doDirectAttack(0, this.stamina, source, target, game);
                } else {
                    this.doDirectAttack(this.damage, this.stamina, source, target, game);
                }
                break;
            case TurnAction.PARRY:
                this.doDirectAttack(0, this.stamina, source, target, game);
                break;
            case TurnAction.BLOCK:
                if (target.isBlocking(source)) {
                    this.doDirectAttack(0, this.stamina, source, target, game);
                } else {
                    this.doDirectAttack(this.damage, this.stamina, source, target, game);
                }
                break;
            case TurnAction.PREPARE:
                this.doDirectAttack(this.damage, this.stamina, source, target, game);
                break;
            default:
                assertUnreachable(targetAction);
        }
        source.decreaseStamina(this.stamina);
    }
}

export default BasicNormalWeapon;