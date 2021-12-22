import { nonNull, passFirst } from "../../../util";
import { CombatOption, TargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { Weapon, TurnAction, WeaponType } from "./weapon";

abstract class LightWeapon extends Weapon {

    options(player: Player): CombatOption[] {
        return nonNull(
            CombatOption.forName(
                "attack",
                new TargetedCombatAction(
                    player,
                    TurnAction.LIGHT_ATTACK,
                    passFirst(player, this.attack)
                )
            ),
            this.canParry(player)
                ? CombatOption.forName(
                    "parry",
                    new TargetedCombatAction(
                        player,
                        TurnAction.PARRY,
                        passFirst(player, this.parry)
                    )
                )
                : undefined
        );
    }

    abstract attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;
    abstract parry(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;

    private canParry(player: Player) {
        return player.mainHand?.type === WeaponType.LIGHT && player.offHand?.type == WeaponType.LIGHT && player.mainHand === this;
    }
}

export default LightWeapon;