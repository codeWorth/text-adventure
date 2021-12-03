import Direction from "../userinput/direction";
import Player from "./player";
import PlayerConfig from "../playerConfig";

class Game {
    private readonly writeLog: (entry: string) => void;
    private readonly writeError: (entry: string) => void;
    public readonly player: Player;

    constructor(
        writeLog: (entries: string) => void, 
        writeError: (entries: string) => void,
        playerConfig: PlayerConfig
    ) {
        this.writeLog = writeLog;
        this.writeError = writeError;
        this.player = new Player(playerConfig);
    }

    go(direction: Direction) {
        this.writeLog(`going ${direction}`);
    }

    look() {
        this.writeLog(`looking around`);
    }

    log(message: string) {
        this.writeLog(message);
    }

    error(message: string) {
        this.writeError(message);
    }
};

export default Game;