import Key from "../items/key";
import Room from "../room";

class Connection {
    public readonly roomA: Room;
    public readonly roomB: Room;
    public locked = false;
    public readonly key?: Key;

    constructor(roomA: Room, roomB: Room) {
        this.roomA = roomA;
        this.roomB = roomB;
    }

    needsUnlock(): boolean {
        return !!this.key;
    }
}

export default Connection;