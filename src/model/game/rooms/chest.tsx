import Game from "../game";
import TakeableItems, { ItemInfo } from "./takeableItems";

class Chest {

    private readonly takeableItems: TakeableItems;
    private readonly openMessage: string;
    private _isOpen: boolean;

    constructor(items: ItemInfo[], openMessage: string | undefined) {
        this.takeableItems = new TakeableItems(...items);
        this.openMessage = openMessage || "You unlatch the chest and open it up.";
        this._isOpen = false;
    }

    isOpen(): boolean {
        return this._isOpen;
    }

    open(game: Game) {
        if (this._isOpen) return;
        this.takeableItems.discoverItems();

        game.log(this.openMessage + " Inside you find:")
        this.takeableItems.knownItems()
            .forEach(item => game.log(` - ${item.item.name}`));

        this._isOpen = true;
    }

}

export default Chest;