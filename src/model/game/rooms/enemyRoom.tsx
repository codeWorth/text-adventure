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

class EnemyRoom extends Room {

    private readonly enemy: BasicEnemy;
    private inCombat: boolean;

    constructor(name: string) {
        super(name);
        this.enemy = new BasicEnemy("Skeleton", 6, 6, new BasicNormalWeapon("", [], 1, 1));
        this.inCombat = false;
    }

    getOptions(game: Game): Option[] {
        if (this.inCombat) {
            return nonNull(
                game.player.attackOption(game, this.enemy)
            );
        } else {
            return [
                ...super.getOptions(game),
                Option.forName("look", new LookBuilder(
                    "There's a skeleton sitting in the corner. Wonder what they're up to!\n" + this.connections.getDescription(),
                    new OptionsBuilder(
                        "You must specify what to look at.",
                        Option.forName(" skeleton", new LogAction("The skeleton is sleeping right now, but you could attack them if you felt like it :D"))
                    )
                )),
                Option.forName("attack", new OptionsBuilder(
                    "You must chose what to attack.",
                    Option.forName(" skeleton", new PureAction(() => {
                        game.log("Time to attack (:");
                        this.inCombat = true;
                    }))
                ))
            ];
        }
    }
}

export default EnemyRoom;