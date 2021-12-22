import { nonNull, passFirst } from "../../../util";
import { CombatOption, TargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { Weapon, TurnAction, WeaponType, EquipHand } from "./weapon";

abstract class LightWeapon extends Weapon {

    protected readonly attackStamina: number;
    protected readonly parryStamina: number;

    constructor(name: string, pickupNames: string[], attackStamina: number, parryStamina: number, hand: EquipHand) {
        super(name, pickupNames, WeaponType.LIGHT, hand);
        this.attackStamina = attackStamina;
        this.parryStamina = parryStamina;
    }

    options(player: Player): CombatOption[] {
        return nonNull(
            CombatOption.forName(
                "attack",
                new TargetedCombatAction(
                    player,
                    TurnAction.LIGHT_ATTACK,
                    this.attackStamina,
                    passFirst(player, this.attack.bind(this))
                )
            ),
            this.canParry(player)
                ? CombatOption.forName(
                    "parry",
                    new TargetedCombatAction(
                        player,
                        TurnAction.PARRY,
                        this.parryStamina,
                        passFirst(player, this.parry.bind(this))
                    )
                )
                : undefined,
            this.flurryAttack(player)
        );
    }

    abstract attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;
    abstract parry(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;

    private canParry(player: Player) {
        return player.mainHand?.type === WeaponType.LIGHT && player.offHand?.type === WeaponType.LIGHT && player.mainHand === this;
    }

    protected doParry(source: Entity, target: Entity, game: Game) {
        if (source.getStamina() > this.parryStamina) {
            target.stun();
            game.log(`${source.name} parried the attack from ${target.name}. ${target.name} has been stunned!`);
        } else {
            game.log(`${source.name} was too tired to parry.`);
        }
    }

    protected flurryAttack(player: Player): CombatOption | undefined {
        if (player.mainHand !== this || !(player.offHand instanceof LightWeapon)) {
            return;
        }

        const offWeapon = player.offHand as LightWeapon;
        return CombatOption.forName(
            "flurry",
            new TargetedCombatAction(
                player,
                TurnAction.LIGHT_ATTACK,
                this.attackStamina + offWeapon.attackStamina,
                (target, targetAction, game, incomingActions) => {
                    this.attack(player, target, targetAction, game, incomingActions);
                    offWeapon.attack(player, target, targetAction, game, incomingActions);
                }
            )
        )
    }
}

export default LightWeapon;