import { assertUnreachable } from "../../../util";
import Entity from "../entity";
import Game from "../game";
import { HeavyWeapon, HeavyWeaponParams } from "./heavyWeapon";
import { ItemParams } from "./item";
import { TurnAction, WeaponParams } from "./weapon";

export type BasicHeavyWeaponParams = {
    attackDamage: number;
    bashDamage: number;
    blockChance: number;
};

export class BasicHeavyWeapon extends HeavyWeapon {
    
    private readonly attackDamage: number;
    private readonly bashDamage: number;
    private readonly blockChance: number;

    constructor(itemParams: ItemParams, weaponParams: WeaponParams, heavyWeaponParams: HeavyWeaponParams, params: BasicHeavyWeaponParams) {
        super(itemParams, weaponParams, heavyWeaponParams);
        this.attackDamage = params.attackDamage;
        this.bashDamage = params.bashDamage;
        this.blockChance = params.blockChance;
    }

    attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void {
        if (!this.prepared) return;
        switch (targetAction) {
            case TurnAction.NORMAL_ATTACK:
                this.doDirectAttack(this.attackDamage, this.attackStamina, source, target, game);
                break;
            case TurnAction.LIGHT_ATTACK:
                this.doDirectAttack(this.attackDamage, this.attackStamina, source, target, game);
                break;
            case TurnAction.HEAVY_ATTACK:
                this.doDirectAttack(this.attackDamage, this.attackStamina, source, target, game);
                break;
            case TurnAction.REST:
                this.doDirectAttack(this.attackDamage, this.attackStamina, source, target, game);
                break;
            case TurnAction.NONE:
                this.doDirectAttack(this.attackDamage, this.attackStamina, source, target, game);
                break;
            case TurnAction.BASH:
                this.doDirectAttack(this.attackDamage, this.attackStamina, source, target, game);
                break;
            case TurnAction.PARRY:
                this.doDirectAttack(0, this.attackStamina, source, target, game);
                break;
            case TurnAction.BLOCK:
                this.doDirectAttack(this.attackDamage, this.attackStamina, source, target, game);
                break;
            case TurnAction.PREPARE:
                this.doDirectAttack(this.attackDamage, this.attackStamina, source, target, game);
                break;
            default:
                assertUnreachable(targetAction);
        }
        source.decreaseStamina(this.attackStamina);
    }

    bash(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void {
        switch (targetAction) {
            case TurnAction.NORMAL_ATTACK:
                this.doDirectAttack(this.bashDamage, this.bashStamina, source, target, game);
                if (Math.random() < this.blockChance) {
                    this.doBlock(source, target, game);
                } else {
                    game.log(`${source.name} tried to block the attack from ${target.name}, but failed.`);
                }
                break;
            case TurnAction.LIGHT_ATTACK:
                this.doDirectAttack(this.bashDamage, this.bashStamina, source, target, game);
                this.doBlock(source, target, game);
                break;
            case TurnAction.HEAVY_ATTACK:
                this.doDirectAttack(this.bashDamage, this.bashStamina, source, target, game);
                game.log(`${source.name} tried to block the attack from ${target.name}, but it was too strong.`);
                break;
            case TurnAction.REST:
                this.doDirectAttack(this.bashDamage, this.bashStamina, source, target, game);
                break;
            case TurnAction.NONE:
                this.doDirectAttack(this.bashDamage, this.bashStamina, source, target, game);
                break;
            case TurnAction.BASH:
                this.doDirectAttack(0, this.bashStamina, source, target, game);
                this.doBlock(source, target, game);
                break;
            case TurnAction.PARRY:
                this.doDirectAttack(0, this.bashStamina, source, target, game);
                break;
            case TurnAction.BLOCK:
                this.doDirectAttack(0, this.bashStamina, source, target, game);
                game.log(`${source.name} braced against an attack from ${target.name}, but none came.`);
                break;
            case TurnAction.PREPARE:
                this.doDirectAttack(this.bashDamage, this.bashStamina, source, target, game);
                break;
            default:
                assertUnreachable(targetAction);
        }
        source.decreaseStamina(this.bashStamina);
    }

    details(): string {
        return `Attack damage: ${this.attackDamage}
Attack stamina usage: ${this.attackStamina}
Bash damage: ${this.bashDamage}
Bash stamina usage: ${this.bashStamina}
Bash block chance: ${Math.floor(this.blockChance * 100)}%
Type: ${this.type}
Equip slot: ${this.hand}`;
    }
}