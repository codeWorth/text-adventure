import Direction from "../userinput/direction";
import Player from "./player";
import PlayerConfig from "../playerConfig";
import Room from "./room";
import { Rooms, makeRooms } from "./rooms";
import { parseInput, ParseResponseType } from "../userinput/input";
import ActionBuilder from "../userinput/actions/actionBuilder";
import { CombinedContextBuilder } from "../userinput/actions/combinedBuilders";
import { actionOrder, TurnAction } from "./items/weapon";
import Enemy from "./enemies/enemy";
import EmptyAction from "../userinput/actions/emptyAction";

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
        this.cachedActions = this.generateActions();
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

    executeTurn(playerActionType: TurnAction, playerAction: (incomingActions: TurnAction[]) => void, playerTarget?: Enemy) {
        // first enemy has lowest action order
        const enemies = this.player.getCombatEnemies()
            .sort((a, b) => actionOrder(a.turnAction(this)) - actionOrder(b.turnAction(this)));
        let playerExecuted = false;
        const playerActionOrder = actionOrder(playerActionType);
        const enemiesActions = enemies.map(enemy => enemy.turnAction(this));

        let i = 0;
        while (i < enemies.length) {
            const enemy = enemies[i];
            const currentActionOrder = actionOrder(enemy.turnAction(this));
            if (!playerExecuted && playerActionOrder <= currentActionOrder) {
                playerExecuted = true;
                playerAction(enemiesActions);
            } else {
                enemy.executeTurn(
                    enemy === playerTarget ? playerActionType : TurnAction.NONE, 
                    this
                );
                i++;
            }
        }

        this.finishTurn();
    }

    private finishTurn() {
        this.player.mainHand?.finishTurn(this.player, this);
        this.player.offHand?.finishTurn(this.player, this);
        this.player.finishTurn(this);

        this.player.getCombatEnemies().forEach(enemy => {
            enemy.mainHand?.finishTurn(enemy, this);
            enemy.offHand?.finishTurn(enemy, this);
            enemy.finishTurn(this);
        });

        this.player.printBattleInfo(this);
        this.player.getCombatEnemies().forEach(enemy => enemy.printBattleInfo(this));
    }

    enterCombat(...enemies: Enemy[]) {
        this.player.printBattleInfo(this);
        enemies.forEach(enemy => {
            enemy.printBattleInfo(this);
            enemy.addDeathListener(() => this.enemyDied(enemy));
        });
        this.player.enterCombat(...enemies);
    }

    private enemyDied(enemy: Enemy) {
        if (!this.player.inCombat) {
            this.player.replenishStamina();
        }
    }

    unlockAllRooms() {
        this.rooms.forEach(room => room.connections.unlockAll());
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
        this.cachedActions = this.generateActions();
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
        this.cachedActions = this.generateActions();
    }

    private enter(room: Room) {
        this.log(`You are in ${room.name}`);
        this.currentRoom = room;
    }

    getCachedActions(): ActionBuilder {
        return this.cachedActions;
    }

    private generateActions(): ActionBuilder {
        if (this.inputMode === InputMode.COMMANDS) {
            return new CombinedContextBuilder(this.player.getActions(), this.currentRoom.getActions(this));
        } else {
            return new EmptyAction();
        }
    }

    private endGame() {
        this.log("Game over!");
        this.inputMode = InputMode.GAME_OVER;
        this.cachedActions = this.generateActions();
    }
};

export default Game;