import { map, nonNull } from "../../../util";
import ActionBuilder from "../../userinput/actions/actionBuilder";
import { CombinedApplyBuilder } from "../../userinput/actions/combinedBuilders";
import LogAction from "../../userinput/actions/logAction";
import PureAction from "../../userinput/actions/pureAction";
import Option from "../../userinput/option";
import Item from "../items/item";
import Player from "../player";

enum ItemState {
    UNKNOWN, KNOWN, TAKEN
}

type ItemEntry = {
    item: Item,
    state: ItemState,
    lookMessage: string,
    pickupMessage?: string
};

export type ItemInfo = {
    item: Item,
    lookMessage: string,
    pickupMessage?: string
};

class TakeableItems {
    private readonly items: ItemEntry[];

    constructor(...items: ItemInfo[]) {
        this.items = items.map(item => ({
            item: item.item,
            state: ItemState.UNKNOWN,
            lookMessage: item.lookMessage,
            pickupMessage: item.pickupMessage 
        }));
    }

    discoverItems() {
        this.items.filter(item => item.state === ItemState.UNKNOWN)
            .forEach(item => item.state = ItemState.KNOWN);
    }

    addKnownItem(item: Item, lookMessage: string, pickupMessage?: string) {
        this.items.push({
            item: item,
            state: ItemState.KNOWN,
            lookMessage: lookMessage,
            pickupMessage: pickupMessage
        });
    }

    getLookAtOptions(): Option[] {
        const presentItems = this.presentItems();
        return presentItems.flatMap(itemEntry => itemEntry.item.pickupNames.map(name => 
            Option.forName(
                " " + name.toLowerCase(), 
                new CombinedApplyBuilder(
                    new LogAction(itemEntry.lookMessage),
                    new PureAction(() => itemEntry.state = ItemState.KNOWN)
                )
            )
        ));
    }

    getTakeOptions(player: Player): Option[] {
        return this.knownItems().flatMap(itemEntry => 
            itemEntry.item.pickupNames.map(name => 
                Option.forName(
                    " " + name.toLowerCase(),
                    new CombinedApplyBuilder(...nonNull<ActionBuilder>(
                        map(itemEntry.pickupMessage, msg => new LogAction(msg)),
                        new LogAction(`You pick up the ${itemEntry.item.name}.`),
                        new PureAction(() => {
                            itemEntry.state = ItemState.TAKEN;
                            player.addItem(itemEntry.item);
                        })
                    ))
                )
            )
        );
    }

    knownItems(): ItemEntry[] {
        return this.items
            .filter(item => item.state === ItemState.KNOWN);
    }

    presentItems(): ItemEntry[] {
        return this.items
            .filter(item => item.state !== ItemState.TAKEN);
    }
};

export default TakeableItems;