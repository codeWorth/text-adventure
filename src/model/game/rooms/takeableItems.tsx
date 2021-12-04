import ActionBuilder from "../../userinput/actions/actionBuilder";
import { CombinedApplyBuilder } from "../../userinput/actions/combinedBuilders";
import LogAction from "../../userinput/actions/logAction";
import LookBuilder from "../../userinput/actions/lookBuilder";
import OptionsBuilder from "../../userinput/actions/optionsBuilder";
import PureAction from "../../userinput/actions/pureAction";
import Option from "../../userinput/option";
import Item from "../item";
import Player from "../player";

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

    constructor(...items: ItemInfo[]) {
        this.items = items.map(item => ({
            item: item.item,
            state: ItemState.UNKNOWN,
            lookMessage: item.lookMessage
        }));
    }

    getLookBuilder(lookMessage: string, player: Player): ActionBuilder {
        const unknownItems = this.unknownItems();
        if (unknownItems.length > 0) {
            return new LookBuilder(lookMessage, new OptionsBuilder(
                "You must specify what to look at.",
                ...unknownItems.map(itemEntry => 
                    Option.forAction(
                        " " + itemEntry.item.name.toLowerCase(), 
                        new CombinedApplyBuilder(
                            new LogAction(itemEntry.lookMessage),
                            new PureAction(() => itemEntry.state = ItemState.KNOWN)
                        )
                    )
                )
            ));
        } else {
            return new LookBuilder(lookMessage);
        }
    }

    getTakeBuilder(player: Player): ActionBuilder | null {
        const knownItems = this.knownItems();
        if (knownItems.length > 0) {
            return new OptionsBuilder(
                "You must specify which item to take.",
                ...knownItems.map(itemEntry =>
                    Option.forAction(
                        " " + itemEntry.item.name.toLowerCase(),
                        new CombinedApplyBuilder(
                            new LogAction(`You pick up the ${itemEntry.item.name}.`),
                            new PureAction(() => {
                                itemEntry.state = ItemState.TAKEN;
                                player.addItem(itemEntry.item);
                            })
                        )
                    )
                )
            )
        } else {
            return null;
        }
    }

    knownItems(): ItemEntry[] {
        return this.items
            .filter(item => item.state === ItemState.KNOWN);
    }

    unknownItems(): ItemEntry[] {
        return this.items
            .filter(item => item.state === ItemState.UNKNOWN);
    }
};

export default TakeableItems;