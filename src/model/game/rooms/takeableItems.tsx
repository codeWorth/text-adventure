import { CombinedApplyBuilder } from "../../userinput/actions/combinedBuilders";
import LogAction from "../../userinput/actions/logAction";
import { LookAt, LookBuilder } from "../../userinput/actions/lookBuilders";
import PureAction from "../../userinput/actions/pureAction";
import TakeBuilder from "../../userinput/actions/takeBuilder";
import Option from "../../userinput/option";
import Item from "../item";
import Room from "../room";

enum ItemState {
    UNKNOWN, KNOWN, TAKEN
}

type ItemEntry = {
    item: Item,
    state: ItemState,
    lookMessage: string
};

export type ItemInfo = {
    item: Item,
    lookMessage: string
};

class TakeableItems {
    private readonly items: ItemEntry[];
    private readonly room: Room;

    constructor(room: Room, ...items: ItemInfo[]) {
        this.room = room;
        this.items = items.map(item => ({
            item: item.item,
            state: ItemState.UNKNOWN,
            lookMessage: item.lookMessage
        }));
    }

    getLookBuilder(lookMessage: string): LookBuilder {
        const unknownItems = this.unknownItems();
        if (unknownItems.length > 0) {
            return new LookBuilder(lookMessage, new LookAt(...unknownItems.map(itemEntry => 
                Option.forAction(
                    " " + itemEntry.item.name.toLowerCase(), 
                    new CombinedApplyBuilder(
                        new LogAction(itemEntry.lookMessage),
                        new PureAction(() => itemEntry.state = ItemState.KNOWN)
                    )
                )
            )));
        } else {
            return new LookBuilder(lookMessage);
        }
    }

    getTakeBuilder(): TakeBuilder | null {
        const knownItems = this.knownItems();
        if (knownItems.length > 0) {
            return new TakeBuilder(this.room, ...knownItems);
        } else {
            return null;
        }
    }

    knownItems(): Item[] {
        return this.items
            .filter(item => item.state === ItemState.KNOWN)
            .map(item => item.item);
    }

    unknownItems(): ItemEntry[] {
        return this.items
            .filter(item => item.state === ItemState.UNKNOWN);
    }
};

export default TakeableItems;