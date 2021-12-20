import { nonNull } from "../../../util";
import Game from "../../game/game";
import Player from "../../game/player";
import Option from "../option";
import ActionBuilder from "./actionBuilder";
import OptionsBuilder from "./optionsBuilder";
import PureAction from "./pureAction";

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
                ...weapons.flatMap(item => {
                    const names = item.pickupNames.map(name => " " + name);
                    if (item.canMainHand() && item.canOffHand()) {
                        return Option.forNames(
                            new OptionsBuilder(
                                "You must specify which hand to equip to.",
                                Option.forName(" to main hand", new PureAction(game => this.player.equipToMainHand(item, game))),
                                Option.forName(" to off hand", new PureAction(game => this.player.equipToOffHand(item, game)))
                            ),
                            ...names
                        );
                    } else if (item.canMainHand()) {
                        return Option.forNames(
                            new PureAction(game => this.player.equipToMainHand(item, game)), 
                            ...names
                        )
                    } else if (item.canOffHand()) {
                        return Option.forNames(
                            new PureAction(game => this.player.equipToOffHand(item, game)), 
                            ...names
                        );
                    } else {
                        return [];
                    }
                })
            )),
            Option.forName("unequip", new OptionsBuilder(
                "You must specify which hand to unequip.",
                ...nonNull(
                    this.player.mainHand
                        ? Option.forName(" main hand", new PureAction(game => this.player.unequipMainHand(game)))
                        : undefined,
                    this.player.offHand
                        ? Option.forName(" off hand", new PureAction(game => this.player.unequipOffHand(game)))
                        : undefined,
                )
            ))
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