import { GoBuilder } from "../../userinput/actions/goBuilders";
import Direction from "../../userinput/direction";
import Option from "../../userinput/option";
import Connection from "./connection";

class Connections {
    private connections: Map<Direction, Connection> = new Map();

    private getDirections(): Direction[] {
        return Array.from(this.connections.keys());
    }

    getConnection(direction: Direction): Connection | undefined {
        return this.connections.get(direction);
    }

    getDirection(connection: Connection): Direction | undefined {
        for (const [direction, conn] of Array.from(this.connections.entries())) {
            if (conn === connection) {
                return direction;
            }
        }
    }

    addConnection(direction: Direction, connection: Connection) {
        this.connections.set(direction, connection);
    }

    getGoOption(): Option | undefined {
        return this.getDirections().length > 0 
            ? Option.forName(
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

    unlockAll() {
        Array.from(this.connections.values())
            .forEach(connection => connection.unlock());
    }
}

export default Connections;