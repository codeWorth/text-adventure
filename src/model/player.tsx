//import Direction from "./direction";

class Player {
    //a player should have
    //a name
    public readonly name: string;

    //health
    private health: number;
    private maxHealth: number;

    //an inventory
    //private inventory: Inventory;

    //equipped weapons or items (like 4 slots)
    //private equipSlots: Slot;
    constructor(){
        this.name = "Link";
        this.health = 10;
        this.maxHealth = 10;
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
    printInventory(){
        return `Name: ${this.name}\nHealth: ${this.getHealthBar()}\n\nItems: EMPTY\n`;
    }
};

export default Player;