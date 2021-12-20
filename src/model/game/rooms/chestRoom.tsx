import Room from "../room";
import Key from "../items/key";
import Game from "../game";
import Option from "../../userinput/option";
import LookBuilder from "../../userinput/actions/lookBuilder";
import OptionsBuilder from "../../userinput/actions/optionsBuilder";
import { nonNull } from "../../../util";
import { Chest, ChestBuilder } from "./chest";

class ChestRoom extends Room {

    private readonly chest: Chest;

    constructor(name: string, largeIronKey: Key) {
        super(name);
        this.chest = ChestBuilder.withItems({
            item: largeIronKey,
            lookMessage: "Surely this large iron key goes to a large iron door..."
        })
            .names("chest", "wooden chest")
            .build();
    }

    getOptions(game: Game): Option[] {
        return nonNull(
            ...super.getOptions(game),
            Option.forName("take", new OptionsBuilder(
                "You must specify which item to take.",
                ...this.chest.getTakeOptions(game.player)
            )),
            Option.forName("look", new LookBuilder(
                "The room is empty except for a wooden chest.\n" + this.connections.getDescription(),
                new OptionsBuilder(
                    "You must specify what to look at.",
                    ...this.chest.getLookOptions()
                )
            )),
            Option.forName("open", new OptionsBuilder(
                "You must specify what to open.",
                ...this.chest.getOpenOptions()
            ))
        )
    }
}

export default ChestRoom;