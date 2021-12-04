import Game from "../../game/game";
import Item from "../../game/item";
import Room from "../../game/room";
import Option from "../option";
import ActionBuilder from "./actionBuilder";

class TakeBuilder implements ActionBuilder {
    private readonly room: Room;
    private readonly items: Item[];

    constructor(room: Room, ...items: Item[]) {
        this.room = room;
        this.items = items;
    }

    context() {
        return this.items.map(item => Option.forAction(" " + item.name, new TakeItem(this.room, item)));
    }

    apply(game: Game) {
        game.error("You must specify the item to take.");
    }
}

class TakeItem implements ActionBuilder {
    private readonly room: Room;
    private readonly item: Item;

    constructor(room: Room, item: Item) {
        this.room = room;
        this.item = item;
    }

    context() {
        return [];
    }

    apply(game: Game) {
        this.room.giveItem(this.item, game.player);
    }
}

export default TakeBuilder;