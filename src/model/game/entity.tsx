import Game from "./game";
import { Weapon, WeaponType } from "./items/weapon";

class Entity {

    public readonly name: string;
    private health: number;
    private stamina: number;
    private maxHealth: number;
    private maxStamina: number;

    public mainHand?: Weapon;
    public offHand?: Weapon;

    private deathListeners: (() => void)[];

    constructor(name: string, maxHealth: number, maxStamina: number) {
        this.name = name;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.maxStamina = maxStamina;
        this.stamina = maxStamina;
        this.deathListeners = [];
    }

    addDeathListener(listener: () => void) {
        this.deathListeners.push(listener);
    }

    canAttack(): boolean {
        const fists = !this.mainHand && !this.offHand;
        const normalWeapon = this.mainHand?.type === WeaponType.NORMAL || this.offHand?.type === WeaponType.NORMAL;
        return fists || normalWeapon;
    }

    getHealth() {
        return this.health;
    }

    getStamina() {
        return this.stamina;
    }

    getMaxHealth() {
        return this.maxHealth;
    }

    getMaxStamina() {
        return this.maxStamina;
    }

    setHealth(health: number) {
        if (health <= 0 && this.isAlive()) {
            this.health = 0;
            this.deathListeners.forEach(listener => listener());
        } else {
            this.health = Math.min(this.maxHealth, health);
        }
    }

    setStamina(stamina: number): boolean {
        if (stamina < 0) {
            return false;
        } else if (stamina > this.maxStamina) {
            return false;
        } else {
            this.stamina = stamina;
            return true;
        }
    }

    increaseStamina(amount: number) {
        this.stamina = Math.min(this.stamina + amount, this.maxStamina);
    }

    increaseMaxHealth(amt: number){
        if(amt > 0){
            this.maxHealth += amt;
        }
    }

    getHealthBar(): string{
        return `${this.getHealth()} / ${this.maxHealth}`;
    }

    getStaminaBar(): string {
        return `${this.getStamina()} / ${this.maxStamina}`;
    }

    isAlive(){
        return this.getHealth() > 0;
    }

    printBattleInfo(game: Game) {
        if (!this.isAlive()) return;
        game.log(`Name: ${this.name}
Health: ${this.getHealthBar()}`);
    }
}

export default Entity;