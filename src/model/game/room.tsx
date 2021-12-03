import ActionBuilder from '../userinput/actions/actionBuilder';
import Game from './game';
import StartRoom from './rooms/startRoom';

interface Room {
    getName(): string;
    getActions(game: Game): ActionBuilder;
};

export type Rooms = {
    startRoom: Room,
    rooms: Room[]
};

export function makeRooms(): Rooms {
    const rooms: Room[] = [];
    const startRoom = new StartRoom();
    rooms.push(new StartRoom());

    return {startRoom: startRoom, rooms: rooms};
}

export default Room;