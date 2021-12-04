import ActionBuilder from '../userinput/actions/actionBuilder';
import Direction, { oppositeDirection } from '../userinput/direction';
import Game from './game';
import Key from './items/key';
import Connection from './rooms/connection';
import Connections from './rooms/connections';
import EnemyRoom from './rooms/enemyRoom';
import RiddleRoom from './rooms/riddleRoom';
import StartRoom from './rooms/startRoom';

interface Room {
    getName(): string;
    getActions(game: Game): ActionBuilder;
    getConnections(): Connections
};

export type Rooms = {
    startRoom: Room,
    rooms: Room[]
};

export function makeRooms(): Rooms {
    const largeIronKey = new Key({
        name: "Large Iron Key", 
        pickupNames: ["key", "iron key"],
        lockedMessage: "You try to open the door, but it's locked shut. The door is huge and made of iron, so you can't force it open."
    });
    const startRoom = new StartRoom();
    const riddleRoom = new RiddleRoom(largeIronKey);
    const enemyRoom = new EnemyRoom();

    connect(startRoom, Direction.EAST, riddleRoom);
    connect(startRoom, Direction.NOTRTH, enemyRoom, largeIronKey);

    return {startRoom: startRoom, rooms: [startRoom, riddleRoom]};
}

function connect(roomA: Room, direction: Direction, roomB: Room, key?: Key) {
    let connection = new Connection(roomA, roomB, key);
    roomA.getConnections().addConnection(direction, connection);
    roomB.getConnections().addConnection(oppositeDirection(direction), connection);
}

export default Room;