import ActionBuilder from "../../userinput/actions/actionBuilder";
import PureAction from "../../userinput/actions/pureAction";
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
        return new PureAction(() => null);
    }
    
    getConnections() {
        return this.connections;
    }
}

export default EnemyRoom;