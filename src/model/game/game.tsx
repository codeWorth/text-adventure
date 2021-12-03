import Direction from "../userinput/direction";
import Player from "./player";
import PlayerConfig from "../playerConfig";
import Room, { makeRooms, Rooms } from "./room";

class Game {
    public readonly player: Player;

    private readonly writeLog: (entry: string) => void;
    private readonly writeError: (entry: string) => void;
    private rooms: Room[];
    private currentRoom: Room;

    constructor(
        writeLog: (entries: string) => void, 
        writeError: (entries: string) => void,
        playerConfig: PlayerConfig
    ) {
        this.writeLog = writeLog;
        this.writeError = writeError;
        this.player = new Player(playerConfig);
        const rooms: Rooms = makeRooms(); 
        this.rooms = rooms.rooms;
        this.currentRoom = rooms.startRoom;
    }

    getCurrentRoom(): Room {
        return this.currentRoom;
    }

    go(direction: Direction) {
        this.writeLog(`Going ${direction}...`);
    }

    log(message: string) {
        this.writeLog(message);
    }

    error(message: string) {
        this.writeError(message);
    }
};

export default Game;