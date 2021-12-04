import ActionBuilder from '../userinput/actions/actionBuilder';
import Direction, { oppositeDirection } from '../userinput/direction';
import Game from './game';
import Connection from './rooms/connection';
import Connections from './rooms/connections';
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
    const startRoom = new StartRoom();
    const riddleRoom = new RiddleRoom();

    connect(startRoom, Direction.EAST, riddleRoom);

    return {startRoom: startRoom, rooms: [startRoom, riddleRoom]};
}

function connect(roomA: Room, direction: Direction, roomB: Room) {
    let connection = new Connection(roomA, roomB);
    roomA.getConnections().addConnection(direction, connection);
    roomB.getConnections().addConnection(oppositeDirection(direction), connection);
}

export default Room;