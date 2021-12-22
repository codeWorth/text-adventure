import { clamp } from "../../../util";
import Entity from "../entity";
import Game from "../game";
import Shield from "./shield";
import { EquipHand, TurnAction } from "./weapon";

class BasicShield extends Shield {

    private readonly blockChance: number;

    constructor(name: string, pickupNames: string[], blockChance: number, hand?: EquipHand) {
        super(name, pickupNames, hand || EquipHand.OFF);
        this.blockChance = clamp(blockChance, 0, 1);
    }

    block(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void {
        
    }

    details(): string {
        
    }
}