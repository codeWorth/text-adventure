import Game from "../../game/game";
import { EquipHand } from "../../game/items/weapon";
import Player from "../../game/player";
import Option from "../option";
import ActionBuilder from "./actionBuilder";
import OptionsBuilder from "./optionsBuilder";
import PureAction from "./pureAction";

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
}

class PlayerAction implements ActionBuilder {

    private readonly player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    context() {
        if (this.player.inCombat) return [];
        
        const weapons = this.player.getWeaponsInInventory();
        return [
            Option.forName("inventory", new ViewInventory()),
            Option.forName("equip", new OptionsBuilder(
                "You must specify which item to equip.",
                ...weapons.flatMap(weapon => {
                    let applyAction: string | PureAction = "You must specify which hand to equip to.";
                    const options = [];

                    if (weapon.hand === EquipHand.BOTH) {
                        applyAction = new PureAction(game => this.player.equipTwoHanded(weapon, game));
                    }

                    if (weapon.hand === EquipHand.MAIN || weapon.hand === EquipHand.ANY) {
                        options.push(...Option.forNames(
                            new PureAction(game => this.player.equipToMainHand(weapon, game)),
                            " to main hand", 
                            " main hand",
                        ));
                    }
                    if (weapon.hand === EquipHand.OFF || weapon.hand === EquipHand.ANY) {
                        options.push(...Option.forNames(
                            new PureAction(game => this.player.equipToOffHand(weapon, game)),
                            " to off hand", 
                            " off hand",
                        ));
                    }

                    if (weapon.hand === EquipHand.ANY && (!this.player.mainHand || this.player.mainHand === this.player.fists)) {
                        applyAction = new PureAction(game => this.player.equipToMainHand(weapon, game));
                    } else if (weapon.hand === EquipHand.ANY && !this.player.offHand) {
                        applyAction = new PureAction(game => this.player.equipToOffHand(weapon, game));
                    }

                    return Option.forNames(
                        new EquipAction(applyAction, ...options),
                        ...weapon.pickupNames
                    );
                }),
                ...Option.forNames(
                    new PureAction(game => this.player.equipTwoHanded(this.player.fists, game)),
                    ...this.player.fists.pickupNames
                )
            )),
            Option.forName("unequip", new OptionsBuilder(
                "You must specify which hand to unequip.",
                ...this.player.mainHand && this.player.mainHand !== this.player.fists
                    ? Option.forNames(
                        new PureAction(game => this.player.unequipMainHand(game)),
                        " main hand",
                        ...this.player.mainHand.pickupNames)
                    : [],
                ...this.player.offHand
                    ? Option.forNames(
                        new PureAction(game => this.player.unequipOffHand(game)),
                        " off hand",
                        ...this.player.offHand.pickupNames)
                    : []
            )),
            Option.forName("unlockall", new PureAction(game => {
                game.unlockAllRooms();
                game.log("All doors have been unlocked!");
            }))
        ];
    }

    apply(game: Game) {
        game.error("Please enter a command");
    }

    terminal(): boolean {
        return false;
    }
}

class ViewInventory implements ActionBuilder {
    context() {
        return [];
    }

    apply(game: Game) {
        game.player.printInventory(game);
    }

    terminal(): boolean {
        return true;
    }
}

export default PlayerAction;