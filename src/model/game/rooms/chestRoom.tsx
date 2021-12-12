import Room from "../room";
import TakeableItems from "./takeableItems";
import Key from "../items/key";
import Game from "../game";
import Option from "../../userinput/option";

class ChestRoom extends Room {

    private readonly takeableItems: TakeableItems = new TakeableItems();
    private readonly largeIronKey: Key;

    constructor(name: string, largeIronKey: Key) {
        super(name);
        this.largeIronKey = largeIronKey;
    }

    getOptions(game: Game): Option[] {
        return super.getOptions(game);
    }
}

export default ChestRoom;