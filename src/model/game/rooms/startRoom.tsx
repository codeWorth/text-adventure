import ActionBuilder from "../../userinput/actions/actionBuilder";
import ActionStart from "../../userinput/actions/actionStart";
import { GoBuilder } from "../../userinput/actions/goBuilders";
import LogAction from "../../userinput/actions/logAction";
import { LookAt, LookBuilder } from "../../userinput/actions/lookBuilders";
import Direction from "../../userinput/direction";
import Option from "../../userinput/option";
import Room from "../room";

class StartRoom implements Room {
    getName(): string {
        return "a dimly lit stone cell.";
    }

    getActions(): ActionBuilder {
        return new ActionStart(
            Option.forAction("go", new GoBuilder(Direction.EAST, Direction.SOUTH)),
            Option.forAction("look", new LookBuilder(
                "There is a single torch on the wall, dimly illuminating the stone walls.",
                new LookAt(Option.forAction(" torch", new LogAction("The torch is affixed to the wall with a sturdy iron bracket. Looking closely at the flame, it doesn't seem to burning from some fuel source. Instead, the flame simply hovers in the basin of the torch."
                )))
            ))
        );
    }
}

export default StartRoom;