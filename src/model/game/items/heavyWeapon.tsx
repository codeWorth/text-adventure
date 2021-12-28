import { assertUnreachable, none, nonNull, passFirst } from "../../../util";
import { CombatOption, TargetedCombatAction, UntargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { ItemParams } from "./item";
import { Weapon, EquipHand, TurnAction, WeaponParams, WeaponType } from "./weapon";

export type HeavyWeaponParams = {
    attackStamina: number;
    bashStamina: number;
};

export abstract class HeavyWeapon extends Weapon {

    private preparedTurns: number;
    public readonly attackStamina: number;
    public readonly bashStamina: number;

    constructor(itemParams: ItemParams, weaponParams: WeaponParams, heavyWeaponParams: HeavyWeaponParams) {
        super(itemParams, weaponParams);
        this.attackStamina = heavyWeaponParams.attackStamina;
        this.bashStamina = heavyWeaponParams.bashStamina;
        this.preparedTurns = 0;
    }

    get prepared() {
        return this.preparedTurns > 0;
    }

    options(player: Player): CombatOption[] {
        return nonNull(
            CombatOption.forName(
                "prepare",
                new UntargetedCombatAction(
                    TurnAction.PREPARE,
                    0,
                    passFirst(player, this.prepare.bind(this))
                )
            ),
            this.prepared
                ? CombatOption.forName(
                    "attack",
                    new TargetedCombatAction(
                        player,
                        TurnAction.NORMAL_ATTACK,
                        this.attackStamina,
                        passFirst(player, this.attack.bind(this))
                    )
                )
                : undefined,
            CombatOption.forName(
                "bash",
                new TargetedCombatAction(
                    player,
                    TurnAction.BASH,
                    this.bashStamina,
                    passFirst(player, this.bash.bind(this))
                )
            )
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
                    return false;
            }
        });

        if (none(interupted)) {
            this.preparedTurns = 2;
            game.log(`${source.name} prepares to strike.`);
        }
    }

    finishTurn(owner: Entity, game: Game): void {
        if (this.prepared) {
            this.preparedTurns--;
        }
    }

    doBlock(source: Entity, target: Entity, game: Game) {
        if (source.getStamina() > this.bashStamina) {
            source.block(target);
            game.log(`${source.name} blocked the attack from ${target.name}!`);
        } else {
            game.log(`${source.name} was too tired to block.`);
        }
    }

    abstract attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;
    abstract bash(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;

    static weaponBuilder() {
        return super.weaponBuilder().hand(EquipHand.BOTH).type(WeaponType.HEAVY);
    }
}