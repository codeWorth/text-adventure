import Room from "../room";
import TakeableItems from "./takeableItems";
import Key from "../items/key";
import Game from "../game";
import Option from "../../userinput/option";
import LookBuilder from "../../userinput/actions/lookBuilder";
import OptionsBuilder from "../../userinput/actions/optionsBuilder";
import LogAction from "../../userinput/actions/logAction";
import { nonNull } from "../../../util";
import PureAction from "../../userinput/actions/pureAction";

class ChestRoom extends Room {

    private readonly takeableItems: TakeableItems = new TakeableItems();
    private readonly largeIronKey: Key;
    private chestOpen: boolean;

    constructor(name: string, largeIronKey: Key) {
        super(name);
        this.largeIronKey = largeIronKey;
        this.chestOpen = false;
    }

    getOptions(game: Game): Option[] {
        return nonNull(
            ...super.getOptions(game),
            Option.forAction("take", new OptionsBuilder(
                "You must specify which item to take.",
                ...this.takeableItems.getTakeOptions(game.player)
            )),
            Option.forAction("look", new LookBuilder(
                "The room is empty except for a wooden chest.\n" + this.connections.getDescription(),
                new OptionsBuilder(
                    "You must specify what to look at.",
                    ...Option.forNames(
                        !this.chestOpen 
                            ? new LogAction("The chest is held closed with a simple latch, which shouldn't be too tough to open.")
                            : new LogAction("You've already opened this chest."),
                        " chest",
                        " wooden chest"
                    ),
                    ...this.takeableItems.getLookAtOptions()
                )
            )),
            !this.chestOpen 
                ? Option.forAction("open", new OptionsBuilder(
                    "You must specify what to open.",
                    ...Option.forNames(
                        new PureAction((game) => {
                            game.log("You unlatch the chest and open it up. Inside you find:")
                            game.log(` - ${this.largeIronKey.name}`);
                            this.takeableItems.addKnownItem(this.largeIronKey, "Surely this large iron key goes to a large iron door...");
                            this.chestOpen = true;
                        }),
                        " chest",
                        " wooden chest"
                    )
                ))
                : undefined
        )
    }
}

export default ChestRoom;