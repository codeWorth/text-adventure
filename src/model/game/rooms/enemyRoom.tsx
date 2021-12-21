import { nonNull } from "../../../util";
import LogAction from "../../userinput/actions/logAction";
import LookBuilder from "../../userinput/actions/lookBuilder";
import OptionsBuilder from "../../userinput/actions/optionsBuilder";
import PureAction from "../../userinput/actions/pureAction";
import Option from "../../userinput/option";
import BasicEnemy from "../enemies/basicEnemy";
import Game from "../game";
import BasicNormalWeapon from "../items/basicNormalWeapon";
import Room from "../room";
import TakeableItems from "./takeableItems";

class EnemyRoom extends Room {

    private readonly enemy: BasicEnemy;
    private readonly items: TakeableItems;

    constructor(name: string) {
        super(name);
        this.enemy = new BasicEnemy("Skeleton", 3, 3, new BasicNormalWeapon("Rusty Sword", ["sword"], 1, 1));
        this.items = new TakeableItems();
    }

    getOptions(game: Game): Option[] {
        if (game.player.inCombat) {
            return nonNull(
                game.player.attackOption(),
                game.player.restOption()
            );
        } else {
            return [
                ...super.getOptions(game),
                Option.forName("take", new OptionsBuilder(
                    "You must specify which item to take.",
                    ...this.items.getTakeOptions(game.player)
                )),
                Option.forName("look", new LookBuilder(
                    this.getLookDescription(),
                    new OptionsBuilder(
                        "You must specify what to look at.",
                        ...nonNull(
                            this.enemy.isAlive()
                                ? Option.forName(" skeleton", new LogAction("The skeleton is sleeping right now, but you could try to wake it up."))
                                : undefined,
                            ...this.items.getLookAtOptions()
                        )
                    )
                )),
                ...this.enemy.isAlive()
                    ? Option.forNames(
                        new OptionsBuilder(
                            "You must chose what to attack.",
                            Option.forName(" skeleton", new PureAction(() => {
                                game.log("The skeleton has woken up, and it doesn't look too well rested... Prepare for a fight!");
                                game.enterCombat(this.enemy);
                                this.enemy.addDeathListener(() => {
                                    game.log("The skeleton has been defeated! Its bones fall to the floor, and its rusty sword clatters on top of them.");
                                    if (this.enemy.mainHand) {
                                        this.items.addKnownItem(this.enemy.mainHand, "This old sword has clearly seen better days, but it's better than nothing...");
                                    }
                                });
                            }))
                        ),
                        "wake",
                        "attack")
                    : []
            ];
        }
    }

    private getLookDescription(): string {
        if (this.enemy.isAlive()) {
            return "There's a skeleton sitting in the corner. Wonder what it's up to!\n" + this.connections.getDescription();
        } else {
            return "The skeleton's bones lie in a pile in the corner, with its rusty sword nearby.\n" + this.connections.getDescription()
        }
    }
}

export default EnemyRoom;