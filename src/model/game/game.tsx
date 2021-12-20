import Direction from "../userinput/direction";
import Player from "./player";
import PlayerConfig from "../playerConfig";
import Room from "./room";
import { Rooms, makeRooms } from "./rooms";
import { parseInput, ParseResponseType } from "../userinput/input";
import ActionBuilder from "../userinput/actions/actionBuilder";
import { CombinedContextBuilder } from "../userinput/actions/combinedBuilders";
import { WeaponAction } from "./items/weapon";
import Enemy from "./enemies/enemy";

export enum InputMode {
    COMMANDS, TEXT, GAME_OVER
};

export interface InputListener {
    consumeInput: (message: string, game: Game) => void;
}

class Game {
    public readonly player: Player;

    private readonly writeLog: (entry: string) => void;
    private readonly writeError: (entry: string) => void;
    private readonly restart: () => void;

    private rooms: Room[];
    private currentRoom: Room;

    private inputMode: InputMode = InputMode.COMMANDS;
    private inputListener?: InputListener;

    private cachedActions: ActionBuilder; 

    constructor(
        writeLog: (entries: string) => void, 
        writeError: (entries: string) => void,
        restart: () => void,
        playerConfig: PlayerConfig
    ) {
        this.writeLog = writeLog;
        this.writeError = writeError;
        this.restart = restart;
        this.player = new Player(playerConfig);
        this.player.addDeathListener(() => this.endGame());
        const rooms: Rooms = makeRooms(); 
        this.rooms = rooms.rooms;

        this.currentRoom = rooms.startRoom;
        this.log(`You are in ${this.currentRoom.name}`);

        this.cachedActions = new CombinedContextBuilder(this.player.getActions(), this.currentRoom.getActions(this));
    }

    getCurrentRoom(): Room {
        return this.currentRoom;
    }

    go(direction: Direction) {
        const connection = this.currentRoom.connections.getConnection(direction);
        if (!connection) return;

        const key = connection.getKey();
        if (key) {
            if (this.player.hasKey(key)) {
                this.writeLog(key.openMessage);
                connection.unlock();

            } else {
                this.writeLog(key.lockedMessage);
                return;
            }
        }
        this.writeLog(`Going ${direction}...`);
        this.enter(connection.getDestination(this.currentRoom));
    }

    /*
    Assumptions:
        If only one action is happening this turn, it happens in main hand
        Only normal attacks may happen in both hands
    */
    attackTurn(playerAction: WeaponAction, enemy: Enemy) {
        const enemyAction = enemy.decideAction(this);

        if (enemyAction === WeaponAction.REST) {
            enemy.rest(this);
        } else if (enemyAction !== WeaponAction.NONE) {
            enemy.mainHand?.attack(playerAction, enemy, this.player, this);
            enemy.offHand?.attack(playerAction, enemy, this.player, this);
        }

        if (playerAction === WeaponAction.REST) {
            this.player.rest(this);
        } else if (playerAction !== WeaponAction.NONE) {
            this.player.mainHand?.attack(enemyAction, this.player, enemy, this);
            this.player.offHand?.attack(enemyAction, this.player, enemy, this);
        }

        enemy.printBattleInfo(this);
        this.player.printBattleInfo(this);
    }

    enterCombat(enemy: Enemy) {
        this.player.printBattleInfo(this);
        enemy.printBattleInfo(this);
        this.player.inCombat = true;
        enemy.addDeathListener(() => this.leaveCombat());
    }

    private leaveCombat() {
        this.player.inCombat = false;
        this.player.setStamina(this.player.getMaxStamina());
    }

    log(message: string) {
        this.writeLog(message);
    }

    error(message: string) {
        this.writeError(message);
    }

    consumeNextInput(inputListener: InputListener) {
        this.inputMode = InputMode.TEXT;
        this.inputListener = inputListener;
    }

    handleInput(message: string) {
        if (this.inputMode === InputMode.COMMANDS) {
            const parsed = parseInput(message, this.cachedActions);
            if (parsed.type === ParseResponseType.RESULT) {
                parsed.result.apply(this);
            } else {
                this.error(`Unknown command: ${message}`);
            }
        } else if (this.inputMode === InputMode.TEXT) {
            this.inputListener!.consumeInput(message, this);
            this.inputListener = undefined;
            this.inputMode = InputMode.COMMANDS;
        } else if (this.inputMode === InputMode.GAME_OVER) {
            if (message.trim().toLowerCase() === "restart") {
                this.restart();
            } else {
                this.error("You lost! Type restart to try again");
            }
        }
        this.setCachedActions();
    }

    private enter(room: Room) {
        this.log(`You are in ${room.name}`);
        this.currentRoom = room;
    }

    getCachedActions() {
        return this.cachedActions;
    }

    private setCachedActions() {
        this.cachedActions = new CombinedContextBuilder(this.player.getActions(), this.currentRoom.getActions(this));
    }

    private endGame() {
        this.log("Game over!");
    }
};

export default Game;