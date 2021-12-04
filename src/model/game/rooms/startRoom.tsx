import { nonNull } from "../../../util";
import ActionBuilder from "../../userinput/actions/actionBuilder";
import ActionStart from "../../userinput/actions/actionStart";
import LookBuilder from "../../userinput/actions/lookBuilder";
import OptionsBuilder from "../../userinput/actions/optionsBuilder";
import Option from "../../userinput/option";
import Game from "../game";
import Item from "../item";
import Room from "../room";
import Connections from "./connections";
import TakeableItems from "./takeableItems";

class StartRoom implements Room {

    private readonly takeableItems: TakeableItems;
    private readonly connections: Connections;

    constructor() {
        this.connections = new Connections(this);
        this.takeableItems = new TakeableItems(
            {
                item: new Item("Mysterious Torch", "torch"),
                lookMessage: "The torch is affixed to the wall with a sturdy iron bracket. Looking closely at the flame, it doesn't seem to burning from some fuel source. Instead, the flame simply hovers in the basin of the torch.",
                pickupMessage: "With a bit of effort, you're able to yank the torch out of its holder."
            }
        );
    }

    getName() {
        return "a dimly lit stone cell.";
    }

    getActions(game: Game): ActionBuilder {
        const lookAtOptions = this.takeableItems.getLookAtOptions(game.player);
        const takeOptions = this.takeableItems.getTakeOptions(game.player);

        return new ActionStart(...nonNull(
            this.connections.getGoOption(),
            Option.forAction("look", new LookBuilder(
                "There is a single torch on the wall, dimly illuminating the stone walls.\n" + this.connections.getDescription(),
                lookAtOptions.length > 0
                    ? new OptionsBuilder(
                        "You must specify what to look at.",
                        ...lookAtOptions)
                    : undefined
            )),
            takeOptions.length > 0
                ? Option.forAction("take", new OptionsBuilder(
                    "You must specify which item to take.",
                    ...takeOptions))
                : undefined
        ));
    }

    getConnections() {
        return this.connections;
    }
}

export default StartRoom;