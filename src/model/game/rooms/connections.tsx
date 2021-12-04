import { GoBuilder } from "../../userinput/actions/goBuilders";
import Direction, { oppositeDirection } from "../../userinput/direction";
import Option from "../../userinput/option";
import Room from "../room";
import Connection from "./connection";

export type ConnectionView = {
    direction: Direction,
    destination: Room
};

class Connections {
    private connections: Map<Direction, Connection> = new Map();

    constructor(private readonly room: Room) {}

    private getDirections(): Direction[] {
        return Array.from(this.connections.keys());
    }

    getConnection(direction: Direction): ConnectionView | undefined {
        const connection = this.connections.get(direction);
        if (!connection) return;
        if (connection.roomA === this.room) {
            return {
                direction: direction,
                destination: connection.roomB
            };
        } else if (connection.roomB === this.room) {
            return {
                direction: oppositeDirection(direction),
                destination: connection.roomA
            };
        }
    }

    addConnection(direction: Direction, connection: Connection) {
        this.connections.set(direction, connection);
    }

    getGoOption(): Option | undefined {
        return this.getDirections().length > 0 
            ? Option.forAction(
                "go", 
                new GoBuilder(...this.getDirections())
            ) 
            : undefined;
    }

    getDescription(): string {
        const directions = this.getDirections();
        if (directions.length === 0) {
            return "There is no way to leave this room.";
        } else if (directions.length === 1) {
            return `There is a door to the ${directions[0]}.`;
        } else if (directions.length === 2) {
            return `There are doors to the ${directions[0]} and ${directions[1]}.`
        } else {
            const startDirections = directions.slice(0, -1)
                .map(direction => direction + ",")
                .join(" ");
            return `There are doors to ${startDirections} and ${directions.slice(-1)[0]}`;
        }
    }
}

export default Connections;