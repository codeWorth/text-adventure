import Direction from "./direction";

class Game {
    private readonly addHistoryEntry: (entry: string) => void;

    constructor(addHistoryEntry: (entries: string) => void) {
        this.addHistoryEntry = addHistoryEntry;
    }

    go(direction: Direction) {
        this.addHistoryEntry(`going ${direction}`);
    }

    look() {
        this.addHistoryEntry(`looking around`);
    }
};

export default Game;