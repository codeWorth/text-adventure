import { any, assertUnreachable, none, nonNull, passFirst } from "../../../util";
import { CombatOption, TargetedCombatAction, UntargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { TurnAction, Weapon } from "./weapon";

abstract class HeavyWeapon extends Weapon {

    private prepared: boolean = false;

    options(player: Player): CombatOption[] {
        return nonNull(
            CombatOption.forName(
                "prepare",
                new UntargetedCombatAction(
                    TurnAction.PREPARE,
                    passFirst(player, this.prepare)
                )
            ),
            this.prepared
                ? CombatOption.forName(
                    "attaack",
                    new TargetedCombatAction(
                        player,
                        TurnAction.NORMAL_ATTACK,
                        passFirst(player, this.attack)
                    )
                )
                : undefined
        );
    }

    prepare(source: Entity, game: Game, incomingActions: TurnAction[]): void {
        const interupted = incomingActions.map(action => {
            switch (action) {
                case TurnAction.NORMAL_ATTACK:
                    return false;
                case TurnAction.LIGHT_ATTACK:
                    return false;
                case TurnAction.HEAVY_ATTACK:
                    return false;
                case TurnAction.REST:
                    return false;
                case TurnAction.NONE:
                    return false;
                case TurnAction.BASH:
                    return false;
                case TurnAction.PARRY:
                    return true;
                case TurnAction.BLOCK:
                    return false;
                case TurnAction.PREPARE:
                    return false;
                default:
                    assertUnreachable(action);
            }
        });

        if (none(interupted)) {
            this.prepared = true;
            game.log(`${source.name} prepares to strike.`);
        }
    }

    abstract attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;

}

export default HeavyWeapon;