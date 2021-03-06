import Enemy from "../../game/enemies/enemy";
import Game from "../../game/game";
import { TurnAction } from "../../game/items/weapon";
import Player from "../../game/player";
import Option from "../option";
import ActionBuilder from "./actionBuilder";
import PureAction from "./pureAction";
import TerminalAction from "./terminalAction";

export type UntargetedPlayerAction = (game: Game, incomingActions: TurnAction[]) => void;
export type TargetedPlayerAction = (target: Enemy, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]) => void;

export type CombatAction = UntargetedCombatAction | TargetedCombatAction;

export class UntargetedCombatAction extends TerminalAction {
    private readonly playerActionType: TurnAction;
    private readonly stamina: number;
    private readonly playerAction: UntargetedPlayerAction;

    constructor(playerActionType: TurnAction, stamina: number, playerAction: UntargetedPlayerAction) {
        super();
        this.playerActionType = playerActionType;
        this.stamina = stamina;
        this.playerAction = playerAction;
    }

    apply(game: Game): void {
        if (game.player.getStamina() >= this.stamina) {
            game.executeTurn(this.playerActionType, actions => this.playerAction(game, actions));
        } else {
            game.error(`You need at least ${this.stamina} stamina to do that.`);
        }
    }
}

export class TargetedCombatAction implements ActionBuilder {

    private readonly player: Player;
    private readonly playerActionType: TurnAction;
    private readonly stamina: number;
    private readonly playerAction: TargetedPlayerAction;

    constructor(player: Player, playerActionType: TurnAction, stamina: number, playerAction: TargetedPlayerAction) {
        this.player = player;
        this.playerActionType = playerActionType;
        this.stamina = stamina;
        this.playerAction = playerAction;
    }

    context(): Option[] {
        return this.player.getCombatEnemies()
            .map(enemy => Option.forName(
                " " + enemy.name, 
                new PureAction(game => this.doAction(enemy, game))
            ));
    }

    apply(game: Game): void {
        if (this.player.getCombatEnemies().length === 1) {
            this.doAction(this.player.getCombatEnemies()[0], game);
        } else {
            game.error("You must specify which enemy to attack.");
        }
    }

    terminal(): boolean {
        return this.player.getCombatEnemies().length === 1;
    }

    usage(): string {
        return "<target>";
    }

    private doAction(target: Enemy, game: Game) {
        if (game.player.getStamina() >= this.stamina) {
            game.executeTurn(
                this.playerActionType, 
                actions => this.playerAction(target, target.turnAction(game), game, actions),
                target
            );
        } else {
            game.error(`You need at least ${this.stamina} stamina to do that.`);
        }
    }
}

export class CombatOption extends Option {
    private constructor(name: string, actionBuilder: CombatAction, consumed: number) {
        super(name, actionBuilder, consumed);
    }

    public static forName(name: string, actionBuilder: CombatAction) {
        return new CombatOption(name, actionBuilder, 0);
    }

    public static forNames(actionBuilder: CombatAction, ...names: string[]) {
        return names.map(name => this.forName(name, actionBuilder));
    }
}