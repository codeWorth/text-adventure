import { map, nonNull } from "../../../util";
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

    getLookBuilder(lookMessage: string, player: Player): ActionBuilder {
        const unknownItems = this.unknownItems();
        if (unknownItems.length > 0) {
            return new LookBuilder(lookMessage, new OptionsBuilder(
                "You must specify what to look at.",
                ...unknownItems.flatMap(itemEntry => itemEntry.item.pickupNames.map(name => 
                    Option.forAction(
                        " " + name.toLowerCase(), 
                        new CombinedApplyBuilder(
                            new LogAction(itemEntry.lookMessage),
                            new PureAction(() => itemEntry.state = ItemState.KNOWN)
                        )
                    )
                ))
            ));
        } else {
            return new LookBuilder(lookMessage);
        }
    }

    getTakeBuilder(player: Player): ActionBuilder | undefined {
        const knownItems = this.knownItems();
        if (knownItems.length > 0) {
            return new OptionsBuilder(
                "You must specify which item to take.",
                ...knownItems.flatMap(itemEntry => itemEntry.item.pickupNames.map(name => 
                    Option.forAction(
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
                ))
            )
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