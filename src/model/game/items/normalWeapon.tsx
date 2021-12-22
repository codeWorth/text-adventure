import { nonNull, passFirst } from "../../../util";
import { CombatOption, TargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { EquipHand, TurnAction, Weapon, WeaponType } from "./weapon";

abstract class NormalWeapon extends Weapon {

    public readonly stamina: number;

    constructor(name: string, pickupNames: string[], stamina: number, hand: EquipHand) {
        super(name, pickupNames, WeaponType.NORMAL, hand);
        this.stamina = stamina;
    }

    options(player: Player): CombatOption[] {
        return nonNull(
            CombatOption.forName(
                "attack",
                new TargetedCombatAction(
                    player,
                    TurnAction.NORMAL_ATTACK,
                    this.stamina,
                    passFirst(player, this.attack.bind(this))
                )
            ),
            this.slashAttack(player)
        );
    }

    abstract attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;

    protected slashAttack(player: Player): CombatOption | undefined {
        if (player.mainHand !== this || !(player.offHand instanceof NormalWeapon)) {
            return;
        }

        const offWeapon = player.offHand as NormalWeapon;
        return CombatOption.forName(
            "slash",
            new TargetedCombatAction(
                player,
                TurnAction.NORMAL_ATTACK,
                this.stamina + offWeapon.stamina,
                (target, targetAction, game, incomingActions) => {
                    this.attack(player, target, targetAction, game, incomingActions);
                    offWeapon.attack(player, target, targetAction, game, incomingActions);
                }
            )
        )
    }
}

export default NormalWeapon;