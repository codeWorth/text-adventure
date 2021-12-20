import PlayerConfig from "../playerConfig";
import PlayerAction from "../userinput/actions/playerActions";
import PureAction from "../userinput/actions/pureAction";
import Option from "../userinput/option";
import Enemy from "./enemies/enemy";
import Entity from "./entity";
import Game from "./game";
import Item from "./items/item";
import Key from "./items/key";
import { ATTACK_MAP, Weapon, WeaponAction } from "./items/weapon";

const STAMINA_REST_AMOUNT = 2;

class Player extends Entity {
    //an inventory
    private inventory: Item[];

    public inCombat: boolean;

    //equipped weapons or items (like 4 slots)
    //private equipSlots: Slot;
    constructor(config: PlayerConfig){
        super(config.name, 10, 10);
        this.inventory = [];
        this.inCombat = false;
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

    equipToMainHand(weapon: Weapon, game: Game) {
        game.log(`Equiped ${weapon.name}.`);
        if (this.mainHand) {
            this.addItem(this.mainHand);
        }
        this.mainHand = weapon;
        this.removeItem(weapon);
    }

    unequipMainHand(game: Game) {
        if (this.mainHand) {
            game.log(`Unequiped ${this.mainHand.name}.`);
            this.addItem(this.mainHand);
            this.mainHand = undefined;
        }
    }

    equipToOffHand(weapon: Weapon, game: Game) {
        game.log(`Equiped ${weapon.name}.`);
        if (this.offHand) {
            this.addItem(this.offHand);
        }
        this.offHand = weapon;
        this.removeItem(weapon);
    }

    unequipOffHand(game: Game) {
        if (this.offHand) {
            game.log(`Unequiped ${this.offHand.name}.`);
            this.addItem(this.offHand);
            this.offHand = undefined;
        }
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
        game.log(`Name: ${this.name}
Health: ${this.getHealthBar()}
Stamina: ${this.getStaminaBar()}

Main Hand: ${this.mainHand?.name || "None"}
Off Hand: ${this.offHand?.name || "None"}

Items: 
${itemsStr}`);
    }

    getActions() {
        return new PlayerAction(this);
    }
};

export default Player;