import { nonNull } from "../../../util";
import LogAction from "../../userinput/actions/logAction";
import LookBuilder from "../../userinput/actions/lookBuilder";
import OptionsBuilder from "../../userinput/actions/optionsBuilder";
import PureAction from "../../userinput/actions/pureAction";
import Option from "../../userinput/option";
import BasicEnemy from "../enemies/basicEnemy";
import Game from "../game";
import { BasicNormalWeapon } from "../items/basicNormalWeapon";
import { HealthPotion } from "../items/healthPotion";
import { Weapon } from "../items/weapon";
import Room from "../room";

class EnemyRoom extends Room {

    private readonly enemy: BasicEnemy;

    constructor(name: string) {
        super(name);
        this.enemy = new BasicEnemy(
            "Skeleton", 
            3, 3, 
            new BasicNormalWeapon(
                BasicNormalWeapon.itemBuilder()
                    .name("Rusty Sword")
                    .pickupNames("sword")
                    .lookMessage("This old sword has clearly seen better days, but it's better than nothing...")
                    .build(),
                BasicNormalWeapon.weaponBuilder().build(),
                {
                    stamina: 1
                },
                {
                    damage: 2
                }
            ),
            new HealthPotion(
                HealthPotion.itemBuilder()
                    .name("Small Health Potion")
                    .pickupNames("health potion", "potion")
                    .build(),
                {
                    health: 3
                }
            )
        );
        // this.enemy.mainHand!.lookMessage = ;
        //"A small vial with a cork on top. It looks (and smells) like something a vegan would drink: very healthy, and completely disgusting."
    }

    getOptions(game: Game): Option[] {
        if (game.player.inCombat) {
            return [];
        } else {
            return [
                ...super.getOptions(game),
                Option.forName("take", new OptionsBuilder(
                    "You must specify which item to take.",
                    ...this.takeableItems.getTakeOptions(game.player)
                )),
                Option.forName("look", new LookBuilder(
                    this.getLookDescription(),
                    new OptionsBuilder(
                        "You must specify what to look at.",
                        ...nonNull(
                            this.enemy.isAlive()
                                ? Option.forName(" skeleton", new LogAction("The skeleton is sleeping right now, but you could try to wake it up."))
                                : undefined,
                            ...this.takeableItems.getLookAtOptions()
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
                                    this.takeableItems.addKnownItem(this.enemy.mainHand as Weapon);
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
        } else if (this.takeableItems.itemPresent(this.enemy.mainHand as Weapon)) {
            return "The skeleton's bones lie in a pile in the corner, with its rusty sword nearby.\n" + this.connections.getDescription()
        } else {
            return "The skeleton's bones lie in a pile in the corner.\n" + this.connections.getDescription()
        }
    }
}

export default EnemyRoom;