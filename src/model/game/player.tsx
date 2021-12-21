import PlayerConfig from "../playerConfig";
import PlayerAction from "../userinput/actions/playerActions";
import PureAction from "../userinput/actions/pureAction";
import Option from "../userinput/option";
import Enemy from "./enemies/enemy";
import Entity from "./entity";
import Game from "./game";
import BasicNormalWeapon from "./items/basicNormalWeapon";
import Item from "./items/item";
import Key from "./items/key";
import { ATTACK_MAP, EquipHand, Weapon, WeaponAction } from "./items/weapon";

const STAMINA_REST_AMOUNT = 2;

class Player extends Entity {
    //an inventory
    private inventory: Item[];

    public inCombat: boolean;
    public readonly fists: BasicNormalWeapon;

    //equipped weapons or items (like 4 slots)
    //private equipSlots: Slot;
    constructor(config: PlayerConfig){
        super(config.name, 10, 10);
        this.inventory = [];
        this.inCombat = false;
        this.fists = new BasicNormalWeapon("Fists", [], 1, 2, EquipHand.BOTH);
        this.equipTwoHanded(this.fists);
    }

    attackOption(enemy: Enemy): Option | undefined {
        if (this.canAttack()) {
            return Option.forName("attack", new PureAction(game => {
                game.attackTurn(this.mainHand ? ATTACK_MAP[this.mainHand.type] : WeaponAction.NONE, enemy);
            }))
        }
    }

    restOption(enemy: Enemy) {
        return Option.forName("rest", new PureAction(game => {
            game.attackTurn(WeaponAction.REST, enemy);
        }));
    }

    rest(game: Game) {
        const oldStamina = this.getStamina();
        this.increaseStamina(STAMINA_REST_AMOUNT);
        game.log(`You take a quick breather. Phew! You regained ${this.getStamina() - oldStamina} stamina.`);
    }

    equipToMainHand(weapon: Weapon, game?: Game) {
        if (weapon.hand !== EquipHand.ANY && weapon.hand !== EquipHand.MAIN) {
            game?.error(`You cannot equip ${weapon.name} to your main hand.`);
            return;
        }

        this.unequipMainHand(game);
        game?.log(`Equiped ${weapon.name} to your main hand.`);
        this.mainHand = weapon;
        this.removeItem(weapon);
    }

    unequipMainHand(game?: Game) {
        if (this.mainHand) {
            game?.log(`Unequiped ${this.mainHand.name}.`);
            if (this.mainHand !== this.fists) {
                this.addItem(this.mainHand);
            }
            this.mainHand = undefined;
        }
    }

    equipToOffHand(weapon: Weapon, game?: Game) {
        if (weapon.hand !== EquipHand.ANY && weapon.hand !== EquipHand.OFF) {
            game?.error(`You cannot equip ${weapon.name} to your off hand.`);
            return;
        }

        if (this.mainHand?.hand === EquipHand.BOTH) {
            this.unequipMainHand(game);
        } else {
            this.unequipOffHand(game);
        }
        game?.log(`Equiped ${weapon.name} to your off hand.`);
        this.offHand = weapon;
        this.removeItem(weapon);
    }

    unequipOffHand(game?: Game) {
        if (this.offHand) {
            game?.log(`Unequiped ${this.offHand.name}.`);
            this.addItem(this.offHand);
            this.offHand = undefined;
        }
    }

    equipTwoHanded(weapon: Weapon, game?: Game) {
        this.unequipMainHand(game);
        this.unequipOffHand(game);
        game?.log(`Equiped ${weapon.name}.`);
        this.mainHand = weapon;
        this.removeItem(weapon);
    }

    getWeaponsInInventory() {
        return this.inventory.filter(item => item instanceof Weapon)
            .map(item => item as Weapon);
    }

    hasKey(key: Key): boolean {
        return !!this.inventory.find(item => item === key);
    }

    addItem(item: Item) {
        this.inventory.push(item);
    }

    private removeItem(item: Item) {
        this.inventory = this.inventory.filter(_item => _item !== item);
    }

    printBattleInfo(game: Game) {
        game.log(`Name: ${this.name}
Health: ${this.getHealthBar()}
Stamina: ${this.getStaminaBar()}`);
    }

    printInventory(game: Game){
        const itemsStr = this.inventory.length === 0
            ? "No items."
            : this.inventory.map(item => "    - " + item.name).join("\n");
        
        let weaponStr = 
`Main Hand: ${this.mainHand?.name || "None"}
Off Hand: ${this.offHand?.name || "None"}`;

        if (this.mainHand?.hand === EquipHand.BOTH) {
            weaponStr = `Hands: ${this.mainHand.name}`;
        }

        game.log(
`Name: ${this.name}
${weaponStr}

Items: 
${itemsStr}`
        );
    }

    getActions() {
        return new PlayerAction(this);
    }
};

export default Player;