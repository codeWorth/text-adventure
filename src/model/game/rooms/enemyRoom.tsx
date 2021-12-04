import { nonNull } from "../../../util";
import ActionBuilder from "../../userinput/actions/actionBuilder";
import ActionStart from "../../userinput/actions/actionStart";
import Game from "../game";
import Room from "../room";
import Connections from "./connections";

class EnemyRoom implements Room {

    private readonly connections: Connections;

    constructor() {
        this.connections = new Connections(this);
    }

    getName() {
        return "a room with a marble floor.";
    }

    getActions(game: Game): ActionBuilder {
        return new ActionStart(...nonNull(
            this.connections.getGoOption()
        ));
    }
    
    getConnections() {
        return this.connections;
    }
}

export default EnemyRoom;