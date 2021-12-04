import ActionBuilder from "../../userinput/actions/actionBuilder";
import ActionStart from "../../userinput/actions/actionStart";
import { GoBuilder } from "../../userinput/actions/goBuilders";
import Direction from "../../userinput/direction";
import Option from "../../userinput/option";
import Item from "../item";
import Player from "../player";
import Room from "../room";
import TakeableItems from "./takeableItems";

class StartRoom implements Room {

    private readonly takeableItems: TakeableItems;

    constructor() {
        this.takeableItems = new TakeableItems(this,
            {
                item: new Item("torch"),
                lookMessage: "The torch is affixed to the wall with a sturdy iron bracket. Looking closely at the flame, it doesn't seem to burning from some fuel source. Instead, the flame simply hovers in the basin of the torch."
            }
        );
    }

    getName(): string {
        return "a dimly lit stone cell.";
    }

    getActions(): ActionBuilder {
        const options: Option[] = [
            Option.forAction("go", new GoBuilder(Direction.EAST, Direction.SOUTH)),
            Option.forAction("look", this.takeableItems.getLookBuilder("There is a single torch on the wall, dimly illuminating the stone walls."))
        ];

        const takeBuilder = this.takeableItems.getTakeBuilder();
        if (takeBuilder) {
            options.push(Option.forAction("take", takeBuilder));
        }

        return new ActionStart(...options);
    }

    giveItem(item: Item, player: Player) {

    }
}

export default StartRoom;