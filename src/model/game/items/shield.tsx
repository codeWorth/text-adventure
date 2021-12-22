import { passFirst } from "../../../util";
import { CombatOption, TargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { EquipHand, TurnAction, Weapon, WeaponType } from "./weapon";

abstract class Shield extends Weapon {

    constructor(name: string, pickupNames: string[], stamina: number, hand: EquipHand) {
        super(name, pickupNames, stamina, WeaponType.NORMAL, hand);
    }

    options(player: Player): CombatOption[] {
        return [
            CombatOption.forName(
                "block",
                new TargetedCombatAction(
                    player,
                    TurnAction.BLOCK,
                    this.stamina,
                    passFirst(player, this.block.bind(this))
                )
            )
        ];
    }

    abstract block(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;

    doBlock(source: Entity, target: Entity, game: Game) {
        if (source.getStamina() > this.stamina) {
            source.block(target);
            game.log(`${source.name} blocked the attack from ${target.name}!`);
        } else {
            game.log(`${source.name} was too tired to block.`);
        }
    }
}

export default Shield;