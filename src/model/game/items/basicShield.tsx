import { assertUnreachable, clamp } from "../../../util";
import Entity from "../entity";
import Game from "../game";
import { ItemParams } from "./item";
import { Shield, ShieldParams } from "./shield";
import { TurnAction, WeaponParams, WeaponType } from "./weapon";

export type BasicShieldParams = {
    blockChance: number;
};

export class BasicShield extends Shield {

    private readonly blockChance: number;

    constructor(itemParams: ItemParams, weaponParams: WeaponParams, shieldParams: ShieldParams, basicShieldParams: BasicShieldParams) {
        super(itemParams, weaponParams, shieldParams);
        this.blockChance = clamp(basicShieldParams.blockChance, 0, 1);
    }

    block(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void {
        switch (targetAction) {
            case TurnAction.NORMAL_ATTACK:
                if (Math.random() < this.blockChance) {
                    this.doBlock(source, target, game);
                } else {
                    game.log(`${source.name} tried to block the attack from ${target.name}, but failed.`);
                }
                break;
            case TurnAction.LIGHT_ATTACK:
                this.doBlock(source, target, game);
                break;
            case TurnAction.HEAVY_ATTACK:
                game.log(`${source.name} tried to block the attack from ${target.name}, but it was too strong.`);
                break;
            case TurnAction.REST:
                game.log(`${source.name} braced against an attack from ${target.name}, but none came.`);
                break;
            case TurnAction.NONE:
                game.log(`${source.name} braced against an attack from ${target.name}, but none came.`);
                break;
            case TurnAction.BASH:
                this.doBlock(source, target, game);
                game.log(`${source.name} blocked the attack from ${target.name}!`);
                break;
            case TurnAction.PARRY:
                game.log(`${source.name} braced against an attack from ${target.name}, but none came.`);
                break;
            case TurnAction.BLOCK:
                game.log(`${source.name} braced against an attack from ${target.name}, but none came.`);
                break;
            case TurnAction.PREPARE:
                game.log(`${source.name} braced against an attack from ${target.name}, but none came.`);
                break;
            default:
                assertUnreachable(targetAction);
        }
        source.decreaseStamina(this.stamina);
    }

    details(): string {
        return `Block chance: ${Math.floor(this.blockChance * 100)}%
Stamina usage: ${this.stamina}
Type: ${this.type}
Equip slot: ${this.hand}`;
    }

    static weaponBuilder() {
        return super.weaponBuilder().type(WeaponType.NORMAL);
    }
}