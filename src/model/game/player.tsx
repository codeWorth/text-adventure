//import Direction from "./direction";
import PlayerConfig from "../playerConfig";
import PlayerAction from "../userinput/actions/playerActions";
import Game from "./game";
import Item from "./item";

class Player {
    //a player should have
    //a name
    public readonly name: string;

    //health
    private health: number;
    private maxHealth: number;

    //an inventory
    private inventory: Item[];

    //equipped weapons or items (like 4 slots)
    //private equipSlots: Slot;
    constructor(config: PlayerConfig){
        this.name = config.name;
        this.health = 10;
        this.maxHealth = 10;
        this.inventory = [];
    }
    /*constructor(config: Config) {
        this.name = config.player.name;
        this.health = config.player.health;
        this.maxHealth = config.player.maxHealth;
    }*/
    increaseMaxHealth(amt: number){
        if(amt > 0){
            this.maxHealth += amt;
        }
    }

    getHealthBar(): string{
        return `${this.health} / ${this.maxHealth}`;
    }

    getName(){
        return this.name;
    }

    damage(amt: number){
        if(amt > 0){
            this.health -= amt;
            if(this.health < 0)
                this.health = 0;
        }
    }

    heal(amt: number){
        if(amt > 0){
            this.health += amt;
            if(this.health > this.maxHealth)
                this.health = this.maxHealth;
        }
    }

    isAlive(){
        if(this.health < 0){
            return false;
        }
        return true;
    }

    addItem(item: Item) {
        this.inventory.push(item);
    }

    printInventory(game: Game){
        const itemsStr = this.inventory.length === 0
            ? "No items."
            : this.inventory.map(item => "    - " + item.name).join("\n");
        game.log(`Name: ${this.name}
Health: ${this.getHealthBar()}

Items: 
${itemsStr}`);
    }

    getActions() {
        return new PlayerAction();
    }
};

export default Player;