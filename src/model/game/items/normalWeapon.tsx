import { passFirst } from "../../../util";
import { CombatOption, TargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { EquipHand, TurnAction, Weapon, WeaponType } from "./weapon";

abstract class NormalWeapon extends Weapon {

    constructor(name: string, pickupNames: string[], hand: EquipHand) {
        super(name, pickupNames, WeaponType.NORMAL, hand);
    }

    options(player: Player): CombatOption[] {
        return [CombatOption.forName(
            "attack",
            new TargetedCombatAction(
                player,
                TurnAction.NORMAL_ATTACK,
                passFirst(player, this.attack)
            )
        )];
    }

    abstract attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;
}

export default NormalWeapon;