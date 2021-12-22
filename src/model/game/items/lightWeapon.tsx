import { nonNull, passFirst } from "../../../util";
import { CombatOption, TargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { Weapon, TurnAction, WeaponType, EquipHand } from "./weapon";

abstract class LightWeapon extends Weapon {

    constructor(name: string, pickupNames: string[], stamina: number, hand: EquipHand) {
        super(name, pickupNames, stamina, WeaponType.LIGHT, hand);
    }

    options(player: Player): CombatOption[] {
        return nonNull(
            CombatOption.forName(
                "attack",
                new TargetedCombatAction(
                    player,
                    TurnAction.LIGHT_ATTACK,
                    this.stamina,
                    passFirst(player, this.attack.bind(this))
                )
            ),
            this.canParry(player)
                ? CombatOption.forName(
                    "parry",
                    new TargetedCombatAction(
                        player,
                        TurnAction.PARRY,
                        this.stamina,
                        passFirst(player, this.parry.bind(this))
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