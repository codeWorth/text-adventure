import Game from "./game";
import { Weapon, WeaponType } from "./items/weapon";

type Blocking = {
    attacksFrom: Entity;
}

class Entity {

    public readonly name: string;
    private health: number;
    private stamina: number;
    private maxHealth: number;
    private maxStamina: number;
    private stunnedTurns: number;

    public mainHand?: Weapon;
    public offHand?: Weapon;

    private deathListeners: (() => void)[];
    private blocking?: Blocking;

    constructor(name: string, maxHealth: number, maxStamina: number) {
        this.name = name;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.maxStamina = maxStamina;
        this.stamina = maxStamina;
        this.deathListeners = [];
        this.stunnedTurns = 0;
    }

    get stunned() {
        return this.stunnedTurns > 0;
    }

    addDeathListener(listener: () => void) {
        this.deathListeners.push(listener);
    }

    canAttack(): boolean {
        if (this.stunned) return false;
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

    decreaseStamina(amount: number) {
        this.stamina = Math.max(0, this.stamina - amount);
    }

    increaseStamina(amount: number) {
        this.stamina = Math.min(this.stamina + amount, this.maxStamina);
    }

    replenishStamina() {
        this.stamina = this.maxStamina;
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

    block(attacksFrom: Entity) {
        this.blocking = {attacksFrom: attacksFrom};
    }

    isBlocking(attacksFrom: Entity) {
        return this.blocking?.attacksFrom === attacksFrom;
    }

    stun() {
        this.stunnedTurns = 2;
    }

    calculateOutgoingDamage(baseDamage: number, to: Entity): number {
        return baseDamage;
    }

    calculateIncomingDamage(baseDamage: number, from: Entity, weapon: Weapon): number {
        return baseDamage;
    }

    printBattleInfo(game: Game) {
        if (!this.isAlive()) return;
        game.log(`${this.name}
Health: ${this.getHealthBar()}
Stamina: ${this.getStaminaBar()}`);
    }

    finishTurn(game: Game) {
        this.blocking = undefined;
        if (this.stunned) {
            this.stunnedTurns--;
            if (!this.stunned) game.log(`${this.name} has recovered from being stunned.`);
        }
    }
}

export default Entity;