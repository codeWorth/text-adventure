import { nonNull, passFirst } from "../../../util";
import { CombatOption, TargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { ItemParams } from "./item";
import { Weapon, TurnAction, WeaponType, EquipHand, WeaponParams } from "./weapon";

export type LightWeaponParams = {
    attackStamina: number;
    parryStamina: number;
}

export abstract class LightWeapon extends Weapon {

    public readonly attackStamina: number;
    public readonly parryStamina: number;

    constructor(itemParams: ItemParams, weaponParams: WeaponParams, lightWeaponParams: LightWeaponParams) {
        super(itemParams, weaponParams);
        this.attackStamina = lightWeaponParams.attackStamina;
        this.parryStamina = lightWeaponParams.parryStamina;
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

    static weaponBuilder() {
        return super.weaponBuilder().hand(EquipHand.ANY).type(WeaponType.LIGHT);
    }
}