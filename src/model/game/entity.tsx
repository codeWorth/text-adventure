import Game from "./game";
import { Weapon, WeaponType } from "./items/weapon";

class Entity {

    public readonly name: string;
    private health: number;
    private stamina: number;
    protected maxHealth: number;
    protected maxStamina: number;

    public mainHand?: Weapon;
    public offHand?: Weapon;

    constructor(name: string, maxHealth: number, maxStamina: number) {
        this.name = name;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.maxStamina = maxStamina;
        this.stamina = maxStamina;
    }

    canAttack(): boolean {
        return this.mainHand?.type === WeaponType.NORMAL || this.offHand?.type === WeaponType.NORMAL;
    }

    getHealth() {
        return this.health;
    }

    getStamina() {
        return this.stamina;
    }

    setHealth(health: number) {
        this.health = health;
    }

    setStamina(stamina: number): boolean {
        if (stamina < 0) {
            return false;
        } else {
            this.stamina = stamina;
            return true;
        }
    }

    getHealthBar(): string{
        return `${this.getHealth()} / ${this.maxHealth}`;
    }

    getStaminaBar(): string {
        return `${this.getStamina()} / ${this.maxStamina}`;
    }

    printBattleInfo(game: Game) {
        game.log(`Name: ${this.name}
Health: ${this.getHealthBar()}`);
    }
}

export default Entity;