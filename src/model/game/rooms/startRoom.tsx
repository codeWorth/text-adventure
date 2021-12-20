import LookBuilder from "../../userinput/actions/lookBuilder";
import OptionsBuilder from "../../userinput/actions/optionsBuilder";
import Option from "../../userinput/option";
import Game from "../game";
import Torch from "../items/torch";
import Room from "../room";
import TakeableItems from "./takeableItems";

class StartRoom extends Room {

    private readonly takeableItems: TakeableItems;

    constructor() {
        super("a dark stone cell.");
        this.takeableItems = new TakeableItems(
            {
                item: new Torch("Mysterious Torch", ["torch"]),
                lookMessage: "The torch is affixed to the wall with a sturdy iron bracket. Looking closely at the flame, it doesn't seem to be burning from some fuel source. Instead, the flame simply hovers in the basin of the torch.",
                pickupMessage: "With a bit of effort, you're able to yank the torch out of its holder."
            }
        );
    }

    getOptions(game: Game): Option[] {
        return [
            ...super.getOptions(game),
            Option.forName("look", new LookBuilder(
                "There is a single torch on the wall, dimly illuminating the stone walls.\n" + this.connections.getDescription(),
                new OptionsBuilder(
                    "You must specify what to look at.",
                    ...this.takeableItems.getLookAtOptions()
                )
            )),
            Option.forName("take", new OptionsBuilder(
                "You must specify which item to take.",
                ...this.takeableItems.getTakeOptions(game.player)
            ))
        ];
    }
}

export default StartRoom;