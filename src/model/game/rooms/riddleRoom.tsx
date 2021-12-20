import { nonNull } from "../../../util";
import { CombinedApplyBuilder } from "../../userinput/actions/combinedBuilders";
import LogAction from "../../userinput/actions/logAction";
import LookBuilder from "../../userinput/actions/lookBuilder";
import OptionsBuilder from "../../userinput/actions/optionsBuilder";
import PureAction from "../../userinput/actions/pureAction";
import Direction from "../../userinput/direction";
import Option from "../../userinput/option";
import Game, { InputListener } from "../game";
import Room from "../room";

const pedestalMessage = `The pedestal reads:
    Bro uhhhhh, let's uhhhh go bro??`;

class RiddleRoom extends Room implements InputListener {

    private readonly riddleDoorDir: Direction;

    constructor(name: string, riddleDoorDir: Direction) {
        super(name);
        this.riddleDoorDir = riddleDoorDir;
    }

    getOptions(game: Game): Option[] {
        return nonNull(
            ...super.getOptions(game),
            Option.forName("look", new LookBuilder(
                "A small pedestal stands in the center of the room.\n" + this.connections.getDescription(),
                new OptionsBuilder(
                    "You must specify what to look at.",
                    Option.forName(" pedestal", new CombinedApplyBuilder(
                        new LogAction(pedestalMessage),
                        new PureAction(() => game.consumeNextInput(this))
                    )),
                )
            ))
        );
    }

    consumeInput(message: string, game: Game) {
        if (message.toLowerCase() === "bro") {
            game.log("That is the correct answer.");
            game.log(`You hear the lock on the door to the ${this.riddleDoorDir} slide open.`);
            this.connections.getConnection(this.riddleDoorDir)?.unlock();
        } else {
            game.log("That is not the correct answer.");
        }
    }
}

export default RiddleRoom;