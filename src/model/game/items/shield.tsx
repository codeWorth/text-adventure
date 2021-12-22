import { passFirst } from "../../../util";
import { CombatOption, TargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { EquipHand, TurnAction, Weapon, WeaponType } from "./weapon";

abstract class Shield extends Weapon {

    constructor(name: string, pickupNames: string[], hand: EquipHand) {
        super(name, pickupNames, WeaponType.NORMAL, hand);
    }

    options(player: Player): CombatOption[] {
        return [
            CombatOption.forName(
                "block",
                new TargetedCombatAction(
                    player,
                    TurnAction.BLOCK,
                    passFirst(player, this.block)
                )
            )
        ];
    }

    abstract block(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;
}

export default Shield;