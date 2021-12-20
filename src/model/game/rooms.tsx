import Room from "./room";
import Key from "./items/key";
import StartRoom from "./rooms/startRoom";
import RiddleRoom from "./rooms/riddleRoom";
import EnemyRoom from "./rooms/enemyRoom";
import Direction from "../userinput/direction";
import Connection from "./rooms/connection";
import { oppositeDirection } from "../userinput/direction";
import ChestRoom from "./rooms/chestRoom";

export type Rooms = {
    startRoom: Room,
    rooms: Room[]
};

export function makeRooms(): Rooms {
    const autoKey = new Key({
        name: "debug-auto-key",
        pickupNames: [],
    });
    const largeIronKey = new Key({
        name: "Large Iron Key", 
        pickupNames: ["key", "iron key"],
        lockedMessage: "You try to open the door, but it's locked shut. The door is huge and made of iron, so you can't force it open."
    });

    const riddleRoom = new RiddleRoom("the Riddle Room", Direction.EAST);
    const chestRoom = new ChestRoom("the Chest Room", largeIronKey);
    connect(riddleRoom, Direction.EAST, chestRoom, autoKey);

    const enemyRoom = new EnemyRoom("the Enemy Room");

    const startRoom = new StartRoom();
    connect(startRoom, Direction.EAST, riddleRoom);
    connect(startRoom, Direction.NOTRTH, enemyRoom);
    // connect(startRoom, Direction.NOTRTH, enemyRoom, largeIronKey);

    return {startRoom: startRoom, rooms: [startRoom, riddleRoom]};
}

function connect(roomA: Room, direction: Direction, roomB: Room, key?: Key) {
    let connection = new Connection(roomA, roomB, key);
    roomA.connections.addConnection(direction, connection);
    roomB.connections.addConnection(oppositeDirection(direction), connection);
    return connection;
}