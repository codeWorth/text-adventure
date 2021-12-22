import { assertUnreachable } from "../../../util";
import Entity from "../entity";
import Game from "../game";
import LightWeapon from "./lightWeapon";
import { EquipHand, TurnAction } from "./weapon";

class BasicLightWeapon extends LightWeapon {

    private readonly damage: number;
    private readonly multiplier: number;

    constructor(name: string, pickupNames: string[], damage: number, attackStamina: number, parryStamina: number, hand?: EquipHand) {
        super(name, pickupNames, attackStamina, parryStamina, hand || EquipHand.ANY);
        this.damage = damage;
        this.multiplier = 2;
    }

    attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void {
        switch (targetAction) {
            case TurnAction.NORMAL_ATTACK:
                this.doDirectAttack(this.damage, this.attackStamina, source, target, game);
                break;
            case TurnAction.LIGHT_ATTACK:
                this.doDirectAttack(this.damage, this.attackStamina, source, target, game);
                break;
            case TurnAction.HEAVY_ATTACK:
                this.doDirectAttack(this.damage, this.attackStamina, source, target, game);
                break;
            case TurnAction.REST:
                this.doDirectAttack(this.damage, this.attackStamina, source, target, game);
                break;
            case TurnAction.NONE:
                this.doDirectAttack(this.damage, this.attackStamina, source, target, game);
                break;
            case TurnAction.BASH:
                if (target.isBlocking(source)) {
                    this.doDirectAttack(0, this.attackStamina, source, target, game);
                } else {
                    this.doDirectAttack(this.damage, this.attackStamina, source, target, game);
                }
                break;
            case TurnAction.PARRY:
                this.doDirectAttack(0, this.attackStamina, source, target, game);
                break;
            case TurnAction.BLOCK:
                if (target.isBlocking(source)) {
                    this.doDirectAttack(0, this.attackStamina, source, target, game);
                } else {
                    this.doDirectAttack(this.damage, this.attackStamina, source, target, game);
                }
                break;
            case TurnAction.PREPARE:
                this.doDirectAttack(this.damage, this.attackStamina, source, target, game);
                break;
            default:
                assertUnreachable(targetAction);
        }
        source.decreaseStamina(this.attackStamina);
    }

    parry(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void {
        switch (targetAction) {
            case TurnAction.NORMAL_ATTACK:
                this.doParry(source, target, game);
                break;
            case TurnAction.LIGHT_ATTACK:
                this.doParry(source, target, game);
                break;
            case TurnAction.HEAVY_ATTACK:
                game.log(`${source.name} tried to parry the attack from ${target.name}, but it was too strong.`);
                break;
            case TurnAction.REST:
                game.log(`${source.name} braced against an attack from ${target.name}, but none came.`);
                break;
            case TurnAction.NONE:
                game.log(`${source.name} braced against an attack from ${target.name}, but none came.`);
                break;
            case TurnAction.BASH:
                this.doParry(source, target, game);
                break;
            case TurnAction.PARRY:
                game.log(`${source.name} braced against an attack from ${target.name}, but none came.`);
                break;
            case TurnAction.BLOCK:
                game.log(`${source.name} braced against an attack from ${target.name}, but none came.`);
                break;
            case TurnAction.PREPARE:
                if (source.getStamina() > this.parryStamina) {
                    target.stun();
                    game.log(`${source.name} interrupted ${target.name}'s attempt to prepare. ${target.name} has been stunned!`);
                } else {
                    game.log(`${source.name} was too tired to parry.`);
                }
                break;
            default:
                assertUnreachable(targetAction);
        }
        source.decreaseStamina(this.parryStamina);
    }

    details(): string {
        return `Damage: ${this.damage}
Attack stamina usage: ${this.attackStamina}
Parry stamina usage: ${this.parryStamina}
Stunned damage multiplier: ${this.multiplier}
Type: ${this.type}
Equip slot: ${this.hand}`;
    }

    protected doDirectAttack(damage: number, stamina: number, source: Entity, target: Entity, game: Game): void {
        if (target.stunned) {
            damage *= this.multiplier;
        }
        super.doDirectAttack(damage, stamina, source, target, game);
    }
}

export default BasicLightWeapon;