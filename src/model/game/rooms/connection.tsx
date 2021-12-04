import Key from "../items/key";
import Room from "../room";

class Connection {
    public readonly roomA: Room;
    public readonly roomB: Room;
    private key?: Key;

    constructor(roomA: Room, roomB: Room, key?: Key) {
        this.roomA = roomA;
        this.roomB = roomB;
        this.key = key;
    }

    getKey(): Key | undefined {
        return this.key;
    }

    unlock() {
        this.key = undefined;
    }

    getDestination(sourceRoom: Room): Room {
        if (sourceRoom === this.roomA) {
            return this.roomB;
        } else {
            return this.roomA;
        }
    }
}

export default Connection;