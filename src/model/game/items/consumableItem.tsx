import Entity from "../entity";
import Game from "../game";
import { Item } from "./item";

abstract class ConsumableItem extends Item {

    public owner?: Entity;

    protected abstract _consume(game: Game): void;

    get canUse(): boolean {
        return this.owner !== undefined;
    }

    addToInventory(entity: Entity) {
        if (this.owner !== undefined) {
            this.owner.removeItem(this);
        }

        entity.addItem(this);
        this.owner = entity;
    }

    consume(game: Game): void {
        if (!this.canUse) return;
        this.owner?.removeItem(this);
        this._consume(game);
    }
}

export default ConsumableItem;