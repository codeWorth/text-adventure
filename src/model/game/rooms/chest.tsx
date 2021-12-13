import LogAction from "../../userinput/actions/logAction";
import PureAction from "../../userinput/actions/pureAction";
import Option from "../../userinput/option";
import Game from "../game";
import Player from "../player";
import TakeableItems, { ItemInfo } from "./takeableItems";

class ChestBuilder {
    public _openMessage: string = "You unlatch the chest and open it up.";
    public _lookMessage: string = "The chest is held closed with a simple latch, which shouldn't be too tough to open.";
    public _names: string[] = [];
    public _items: ItemInfo[];

    private constructor(items: ItemInfo[]) {
        this._items = items;
    }

    openMessage(message: string): ChestBuilder {
        this._openMessage = message;
        return this;
    }

    lookMessage(message: string): ChestBuilder {
        this._lookMessage = message;
        return this;
    }

    names(...names: string[]): ChestBuilder {
        this._names = names;
        return this;
    }

    build() {
        return new Chest(
            this._items, 
            this._openMessage, 
            this._lookMessage, 
            this._names.map(name => " " + name)
        );
    }

    public static withItems(...items: ItemInfo[]) {
        return new ChestBuilder(items);
    }
}

class Chest {

    private readonly takeableItems: TakeableItems;
    private readonly openMessage: string;
    private readonly lookMessage: string;
    private readonly names: string[];
    private _isOpen: boolean;

    constructor(items: ItemInfo[], openMessage: string, lookMessage: string, names: string[]) {
        this.takeableItems = new TakeableItems(...items);
        this.openMessage = openMessage;
        this.lookMessage = lookMessage;
        this.names = names;
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

    getLookOptions(): Option[] {
        return [
            ...Option.forNames(
                !this._isOpen 
                    ? new LogAction(this.lookMessage)
                    : new LogAction("You've already opened this chest."),
                ...this.names
            ),
            ...this.takeableItems.getLookAtOptions()
        ];
    }

    getOpenOptions(): Option[] {
        if (this._isOpen) return [];
        return Option.forNames(
            new PureAction(game => this.open(game)),
            ...this.names
        );
    }

    getTakeOptions(player: Player): Option[] {
        return this.takeableItems.getTakeOptions(player);
    }
}

export { Chest, ChestBuilder };