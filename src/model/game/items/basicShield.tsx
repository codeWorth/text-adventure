import { assertUnreachable, clamp } from "../../../util";
import Entity from "../entity";
import Game from "../game";
import Shield from "./shield";
import { EquipHand, TurnAction } from "./weapon";

class BasicShield extends Shield {

    private readonly blockChance: number;

    constructor(name: string, pickupNames: string[], blockChance: number, stamina: number, hand?: EquipHand) {
        super(name, pickupNames, stamina, hand || EquipHand.OFF);
        this.blockChance = clamp(blockChance, 0, 1);
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
                source.block(target);
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
}

export default BasicShield;
