import Game from "../../game/game";
import { Weapon } from "../../game/items/weapon";
import Player from "../../game/player";
import Option from "../option";
import ActionBuilder from "./actionBuilder";
import LogAction from "./logAction";
import OptionsBuilder from "./optionsBuilder";
import PureAction from "./pureAction";
import TerminalAction from "./terminalAction";

class EquipAction implements ActionBuilder {

    private readonly applyAction: string | PureAction;
    private readonly options: Option[];

    constructor(applyAction: string | PureAction, ...options: Option[]) {
        this.applyAction = applyAction;
        this.options = options;
    }

    context(): Option[] {
        return this.options;
    }

    apply(game: Game): void {
        if (this.applyAction instanceof PureAction) {
            this.applyAction.apply(game);
        } else {
            game.error(this.applyAction);
        }
    }

    terminal(): boolean {
        return this.applyAction instanceof PureAction;
    }

    usage(): string {
        if (this.terminal()) {
            return "";
        } else {
            return "<item>";
        }
    }
}

class ViewInventory extends TerminalAction {
    apply(game: Game) {
        game.player.printInventory(game);
    }
}

class CombatHelpAction extends TerminalAction {

    private readonly options: Option[];

    constructor(...options: Option[]) {
        super();
        this.options = options;
    }

    apply(game: Game): void {
        const namesList = this.options
            .filter(option => option.hasTerminal())
            .map(option => `    -  ${option.name} ${option.actionBuilder.usage()}`)
            .join("\n");
        game.log(`Abilities: \n${namesList}`);
    }
}

class DetailsAction implements ActionBuilder {

    private readonly weapons: Weapon[];

    constructor(...weapons: Weapon[]) {
        this.weapons = weapons;
    }

    context(): Option[] {
        return this.weapons.flatMap(weapon => Option.forNames(
            new LogAction(weapon.details()),
            ...weapon.pickupNames
        ));
    }

    apply(game: Game): void {
        game.error("You must specify what item to get details on.");
    }

    terminal(): boolean {
        return false;
    }

    usage(): string {
        return "<item>";
    }
}

class PlayerAction implements ActionBuilder {

    private readonly player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    context() {
        if (this.player.inCombat) {
            const combatOptions = this.player.combatOptions();
            return [
                ...combatOptions,
                Option.forName("inventory", new ViewInventory()),
                Option.forName("help", new CombatHelpAction(...combatOptions)),
                Option.forName("details", new DetailsAction(...this.player.getWeapons()))
            ];
        } else {
            return [
                Option.forName("inventory", new ViewInventory()),
                Option.forName("equip", new OptionsBuilder(
                    "You must specify which item to equip.",
                    ...this.player.equipOptions()
                )),
                Option.forName("unequip", new OptionsBuilder(
                    "You must specify which hand to unequip.",
                    ...this.player.unequipOptions()
                )),
                Option.forName("details", new DetailsAction(...this.player.getWeapons())),
                Option.forName("unlockall", new PureAction(game => {
                    game.unlockAllRooms();
                    game.log("All doors have been unlocked!");
                }))
            ];
        }
    }

    apply(game: Game) {
        game.error("Please enter a command");
    }

    terminal(): boolean {
        return false;
    }

    usage(): string {
        return "<command>";
    }
}

export { PlayerAction, EquipAction };