import Option from "../../userinput/option";
import Game from "../game";
import Room from "../room";

class EnemyRoom extends Room {

    getOptions(game: Game): Option[] {
        return super.getOptions(game);
    }
}

export default EnemyRoom;