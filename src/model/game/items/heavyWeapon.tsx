import { any, assertUnreachable, none, nonNull, passFirst } from "../../../util";
import { CombatOption, TargetedCombatAction, UntargetedCombatAction } from "../../userinput/actions/combatActions";
import Entity from "../entity";
import Game from "../game";
import Player from "../player";
import { EquipHand, TurnAction, Weapon, WeaponType } from "./weapon";

abstract class HeavyWeapon extends Weapon {

    private prepared: boolean;
    public readonly stamina: number;

    constructor(name: string, pickupNames: string[], stamina: number, hand: EquipHand) {
        super(name, pickupNames, WeaponType.HEAVY, hand);
        this.prepared = false;
        this.stamina = stamina;
    }

    options(player: Player): CombatOption[] {
        return nonNull(
            CombatOption.forName(
                "prepare",
                new UntargetedCombatAction(
                    TurnAction.PREPARE,
                    this.stamina,
                    passFirst(player, this.prepare.bind(this))
                )
            ),
            this.prepared
                ? CombatOption.forName(
                    "attaack",
                    new TargetedCombatAction(
                        player,
                        TurnAction.NORMAL_ATTACK,
                        this.stamina,
                        passFirst(player, this.attack.bind(this))
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

    finishTurn(owner: Entity, game: Game): void {
        this.prepared = false;
    }

    abstract attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void;

}

export default HeavyWeapon;