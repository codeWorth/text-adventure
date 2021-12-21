import { CombatOption, TargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { TurnAction, Weapon } from "./weapon";

abstract class NormalWeapon extends Weapon {

    options(player: Player): CombatOption[] {
        return [CombatOption.forName(
            "attack",
            new TargetedCombatAction(
                player,
                TurnAction.NORMAL_ATTACK,
                (target, targetAction, game) => this.attack(game.player, target, targetAction, game)
            )
        )];
    }

    abstract attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game): void;
}

export default NormalWeapon;