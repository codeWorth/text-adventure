import Direction from "./userinput/direction";

class Game {
    private readonly writeLog: (entry: string) => void;
    private readonly writeError: (entry: string) => void;

    constructor(writeLog: (entries: string) => void, writeError: (entries: string) => void) {
        this.writeLog = writeLog;
        this.writeError = writeError;
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