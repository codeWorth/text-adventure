import { nonNull } from "../../../util";
import ActionBuilder from "../../userinput/actions/actionBuilder";
import ActionStart from "../../userinput/actions/actionStart";
import { CombinedApplyBuilder } from "../../userinput/actions/combinedBuilders";
import LogAction from "../../userinput/actions/logAction";
import LookBuilder from "../../userinput/actions/lookBuilder";
import OptionsBuilder from "../../userinput/actions/optionsBuilder";
import PureAction from "../../userinput/actions/pureAction";
import Option from "../../userinput/option";
import Game, { InputListener } from "../game";
import Key from "../items/key";
import Room from "../room";
import Connections from "./connections";
import TakeableItems from "./takeableItems";

const pedestalMessage = `The pedestal reads:
    Bro uhhhhh, let's uhhhh go bro??`;

class RiddleRoom implements Room, InputListener {

    private readonly takeableItems: TakeableItems = new TakeableItems();
    private readonly connections: Connections;

    constructor() {
        this.connections = new Connections(this);
    }

    getName() {
        return "just a little room ya know!";
    }

    getActions(game: Game): ActionBuilder {
        const takeOptions = this.takeableItems.getTakeOptions(game.player);
        const lookAtOptions = this.takeableItems.getLookAtOptions(game.player);

        return new ActionStart(...nonNull(
            this.connections.getGoOption(),
            takeOptions.length > 0
                ? Option.forAction("take", new OptionsBuilder(
                    "You must specify which item to take.",
                    ...takeOptions))
                : undefined,
            Option.forAction("look", new LookBuilder(
                "A small pedestal stands in the center of the room.\n" + this.connections.getDescription(),
                new OptionsBuilder(
                    "You must specify what to look at.",
                    Option.forAction(" pedestal", new CombinedApplyBuilder(
                        new LogAction(pedestalMessage),
                        new PureAction(() => game.consumeNextInput(this))
                    )),
                    ...lookAtOptions
                )
            ))
        ));
    }
    
    getConnections() {
        return this.connections;
    }

    consumeInput(message: string, game: Game) {
        if (message.toLowerCase() === "bro") {
            game.log("That is the correct answer.");
            game.log("A large iron key falls from the ceiling and hits you on the head.");
            this.takeableItems.addKnownItem(
                new Key("Large Iron Key", "key", "iron key"), 
                "Surely this large iron key goes to a large iron door..."
            );
        } else {
            game.log("That is not the correct answer.");
        }
    }
}

export default RiddleRoom;