import Game from "../game";
import ConsumableItem from "./consumableItem";
import { ItemParams } from "./item";

export type HealthPotionParams = {
    health: number;
};

export class HealthPotion extends ConsumableItem {

    private readonly health: number;

    constructor(itemParams: ItemParams, healthPotionParams: HealthPotionParams) {
        super(itemParams);
        this.health = healthPotionParams.health;
    }

    protected _consume(game: Game): void {
        if (!this.owner) return;
        this.owner.setHealth(this.owner.getHealth() + this.health);
        if (this.owner === game.player) {
            game.log(`You drank a health potion and gained ${this.health} health. You now have ${this.owner.getHealth()} health.`);
        } else {
            game.log(`${this.owner.name} drank a health potion.`);
        }
    }

    details(): string {
        return `When consumed, restores ${this.health} health.`;
    }
}