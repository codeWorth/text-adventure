import { clamp } from "../../../util";
import Entity from "../entity";
import Game from "../game";
import Shield from "./shield";
import { EquipHand, TurnAction } from "./weapon";

class BasicShield extends Shield {

    private readonly blockChance: number;
    private readonly stamina: number;

    constructor(name: string, pickupNames: string[], blockChance: number, stamina: number, hand?: EquipHand) {
        super(name, pickupNames, hand || EquipHand.OFF);
        this.blockChance = clamp(blockChance, 0, 1);
        this.stamina = stamina;
    }

    block(source: Entity, target: Entity, targetAction: TurnAction, game: Game, incomingActions: TurnAction[]): void {
        
    }

    details(): string {
        return `Block chance: ${this.damage}
Stamina usage: ${this.stamina}
Type: ${this.type}
Equip slot: ${this.hand}`;
    }
}