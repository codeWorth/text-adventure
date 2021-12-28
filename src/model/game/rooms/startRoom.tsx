import LookBuilder from "../../userinput/actions/lookBuilder";
import OptionsBuilder from "../../userinput/actions/optionsBuilder";
import Option from "../../userinput/option";
import Game from "../game";
import { BasicHeavyWeapon } from "../items/basicHeavyWeapon";
import { BasicLightWeapon } from "../items/basicLightWeapon";
import { BasicNormalWeapon } from "../items/basicNormalWeapon";
import { BasicShield } from "../items/basicShield";
import Room from "../room";
import TakeableItems from "./takeableItems";

class StartRoom extends Room {

    constructor() {
        super("a dark stone cell.", new TakeableItems(
            new BasicNormalWeapon(
                BasicNormalWeapon.itemBuilder()
                    .name("Mysterious Torch")
                    .pickupNames("torch")
                    .lookMessage("The torch is affixed to the wall with a sturdy iron bracket. Looking closely at the flame, it doesn't seem to be burning from some fuel source. Instead, the flame simply hovers in the basin of the torch.")
                    .pickupMessage("With a bit of effort, you're able to yank the torch out of its holder.")
                    .build(),
                BasicNormalWeapon.weaponBuilder().build(),
                {
                    stamina: 2
                },
                {
                    damage: 2
                }
            )
        ));

        this.takeableItems.addKnownItem(new BasicShield(
            BasicShield.itemBuilder()
                .name("Shield")
                .pickupNames()
                .lookMessage("Ohh a shield yooo")
                .build(),
            BasicShield.weaponBuilder().build(),
            {
                stamina: 2
            },
            {
                blockChance: 0.5
            }
        ));

        this.takeableItems.addKnownItem(new BasicLightWeapon(
            BasicLightWeapon.itemBuilder()
                .name("Red dagger")
                .pickupNames()
                .lookMessage("Dagger :)")
                .build(),
                BasicLightWeapon.weaponBuilder().build(),
                {
                    attackStamina: 1,
                    parryStamina: 2
                },
                {
                    damage: 1
                }
        ));

        this.takeableItems.addKnownItem(new BasicLightWeapon(
            BasicLightWeapon.itemBuilder()
                .name("Blue dagger")
                .pickupNames()
                .lookMessage("Dagger :))")
                .build(),
                BasicLightWeapon.weaponBuilder().build(),
                {
                    attackStamina: 1,
                    parryStamina: 2
                },
                {
                    damage: 1
                }
        ));

        this.takeableItems.addKnownItem(new BasicHeavyWeapon(
            BasicHeavyWeapon.itemBuilder()
                .name("Axe")
                .pickupNames()
                .lookMessage("Big ol' axe")
                .build(),
            BasicHeavyWeapon.weaponBuilder().build(),
            {
                attackStamina: 2,
                bashStamina: 2
            },
            {
                attackDamage: 4,
                bashDamage: 1,
                blockChance: 0.5
            }
        ));
    }

    getOptions(game: Game): Option[] {
        return [
            ...super.getOptions(game),
            Option.forName("look", new LookBuilder(
                "There is a single torch on the wall, dimly illuminating the stone walls.\n" + this.connections.getDescription(),
                new OptionsBuilder(
                    "You must specify what to look at.",
                    ...this.takeableItems.getLookAtOptions()
                )
            )),
            Option.forName("take", new OptionsBuilder(
                "You must specify which item to take.",
                ...this.takeableItems.getTakeOptions(game.player)
            ))
        ];
    }
}

export default StartRoom;