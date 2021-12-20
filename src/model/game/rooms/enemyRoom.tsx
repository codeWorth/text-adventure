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

    constructor(name: string) {
        super(name);
        this.enemy = new BasicEnemy("Skeleton", 6, 6, new BasicNormalWeapon("", [], 1, 1));
    }

    getOptions(game: Game): Option[] {
        if (game.player.inCombat) {
            return nonNull(
                game.player.attackOption(this.enemy),
                game.player.restOption(this.enemy)
            );
        } else {
            return [
                ...super.getOptions(game),
                Option.forName("look", new LookBuilder(
                    "There's a skeleton sitting in the corner. Wonder what they're up to!\n" + this.connections.getDescription(),
                    new OptionsBuilder(
                        "You must specify what to look at.",
                        Option.forName(" skeleton", new LogAction("The skeleton is sleeping right now, but you could try to wake it up."))
                    )
                )),
                ...Option.forNames(
                    new OptionsBuilder(
                        "You must chose what to attack.",
                        Option.forName(" skeleton", new PureAction(() => {
                            game.log("The skeleton has woken up, and it doesn't look too well rested... Prepare for a fight!");
                            game.player.printBattleInfo(game);
                            this.enemy.printBattleInfo(game);
                            game.player.inCombat = true;
                        }))
                    ),
                    "wake",
                    "attack"
                )
            ];
        }
    }
}

export default EnemyRoom;