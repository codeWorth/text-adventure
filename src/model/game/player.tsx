//import Direction from "./direction";
import PlayerConfig from "../playerConfig";
import OptionsBuilder from "../userinput/actions/optionsBuilder";
import PlayerAction from "../userinput/actions/playerActions";
import PureAction from "../userinput/actions/pureAction";
import Option from "../userinput/option";
import Enemy from "./enemies/enemy";
import Entity from "./entity";
import Game from "./game";
import Item from "./items/item";
import Key from "./items/key";
import { ATTACK_MAP, Weapon, WeaponAction } from "./items/weapon";

class Player extends Entity {
    //an inventory
    private inventory: Item[];

    //equipped weapons or items (like 4 slots)
    //private equipSlots: Slot;
    constructor(config: PlayerConfig){
        super(config.name, 10, 10);
        this.inventory = [];
    }

    attackOption(game: Game, enemy: Enemy): Option | undefined {
        if (this.canAttack()) {
            return Option.forName("attack", new PureAction(() => {
                game.attackTurn(this.mainHand ? ATTACK_MAP[this.mainHand.type] : WeaponAction.NONE, enemy);
            }))
        }
    }

    equipOptions(): Option {
        return Option.forName("equip", new OptionsBuilder(
            "You must specify which item to equip.",
            ...this.inventory.filter(item => item instanceof Weapon)
                .map(item => (item as Weapon))
                .filter(item => item.canMainHand() && !item.canOffHand())
                .flatMap(item => Option.forNames(
                    new PureAction(game => this.equipToMainHand(item, game)), 
                    ...item.pickupNames.map(name => " " + name)
                )),
            ...this.inventory.filter(item => item instanceof Weapon)
                .map(item => (item as Weapon))
                .filter(item => !item.canMainHand() && item.canOffHand())
                .flatMap(item => Option.forNames(
                    new PureAction(game => this.equipToOffHand(item, game)), 
                    ...item.pickupNames.map(name => " " + name)
                )),
            ...this.inventory.filter(item => item instanceof Weapon)
                .map(item => (item as Weapon))
                .filter(item => item.canMainHand() && item.canOffHand())
                .flatMap(item => Option.forNames(
                    new OptionsBuilder(
                        "You must specify which hand to equip to.",
                        Option.forName(" to main hand", new PureAction(game => this.equipToMainHand(item, game))),
                        Option.forName(" to off hand", new PureAction(game => this.equipToOffHand(item, game)))
                    ),
                    ...item.pickupNames.map(name => " " + name)
                ))
        ));
    }

    private equipToMainHand(weapon: Weapon, game: Game) {
        game.log(`Equiped ${weapon.name}.`);
        if (this.mainHand) {
            this.addItem(this.mainHand);
        }
        this.mainHand = weapon;
        this.removeItem(weapon);
    }

    private equipToOffHand(weapon: Weapon, game: Game) {
        game.log(`Equiped ${weapon.name}.`);
        if (this.offHand) {
            this.addItem(this.offHand);
        }
        this.offHand = weapon;
        this.removeItem(weapon);
    }

    increaseMaxHealth(amt: number){
        if(amt > 0){
            this.maxHealth += amt;
        }
    }

    getName(){
        return this.name;
    }

    isAlive(){
        if(this.getHealth() < 0){
            return false;
        }
        return true;
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
        return new PlayerAction();
    }
};

export default Player;