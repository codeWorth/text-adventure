import { passFirst } from "../../../util";
import { CombatOption, TargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { EquipHand, TurnAction, Weapon, WeaponType } from "./weapon";

abstract class NormalWeapon extends Weapon {

    protected readonly stamina: number;

    constructor(name: string, pickupNames: string[], stamina: number, hand: EquipHand) {
        super(name, pickupNames, WeaponType.NORMAL, hand);
        this.stamina = stamina;
    }

    options(player: Player): CombatOption[] {
        return [CombatOption.forName(
            "attack",
            new TargetedCombatAction(
                player,
                TurnAction.NORMAL_ATTACK,
                this.stamina,
                passFirst(player, this.attack.bind(this))
            )
        )];
    }

    abstract attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;
}

export default NormalWeapon;