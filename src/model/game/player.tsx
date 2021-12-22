import { nonNull } from "../../util";
import PlayerConfig from "../playerConfig";
import { CombatOption, UntargetedCombatAction } from "../userinput/actions/combatActions";
import OptionsBuilder from "../userinput/actions/optionsBuilder";
import { PlayerAction, EquipAction } from "../userinput/actions/playerActions";
import PureAction from "../userinput/actions/pureAction";
import Option from "../userinput/option";
import Enemy from "./enemies/enemy";
import Entity from "./entity";
import Game from "./game";
import BasicNormalWeapon from "./items/basicNormalWeapon";
import Item from "./items/item";
import Key from "./items/key";
import { EquipHand, TurnAction, Weapon } from "./items/weapon";

const STAMINA_REST_AMOUNT = 2;

class Player extends Entity {
    private inventory: Item[];

    private combatEnemies: Enemy[];
    public readonly fists: BasicNormalWeapon;

    constructor(config: PlayerConfig){
        super(config.name, 10, 10);
        this.inventory = [];
        this.combatEnemies = [];
        this.fists = new BasicNormalWeapon("Fists", [], 1, 2, EquipHand.BOTH);
        this.equipTwoHanded(this.fists);
    }

    get inCombat(): boolean {
        return this.combatEnemies.filter(enemy => enemy.isAlive()).length > 0;
    }

    enterCombat(...enemies: Enemy[]) {
        this.combatEnemies.push(...enemies);
        enemies.forEach(enemy => enemy.addDeathListener(() => this.removeEnemy(enemy)));
    }

    getCombatEnemies() {
        return this.combatEnemies;
    }

    getWeapons(): Weapon[] {
        return nonNull(
            !this.usingFists() ? this.mainHand : undefined,
            this.offHand,
            this.fists,
            ...this.getWeaponsInInventory()
        );
    }

    private removeEnemy(enemy: Enemy) {
        this.combatEnemies = this.combatEnemies.filter(e => e !== enemy);
    }

    combatOptions(): Option[] {
        if (this.stunned) {
            return [
                CombatOption.forName(
                    "wait",
                    new UntargetedCombatAction(
                        TurnAction.NONE,
                        0,
                        () => undefined
                    )
                )
            ];
        }

        const mainOptions: CombatOption[] = this.mainHand?.options(this) || [];
        const offOptions: CombatOption[] = this.offHand?.options(this) || [];

        const mainNames = new Set(mainOptions.map(option => option.name));
        const offNames = new Set(offOptions.map(option => option.name));

        const onlyMainOptions: CombatOption[] = mainOptions.filter(option => !offNames.has(option.name));
        const onlyOffOptions: CombatOption[] = offOptions.filter(option => !mainNames.has(option.name));

        return nonNull(
            ...onlyMainOptions,
            ...onlyOffOptions,
            this.mainHand?.hand !== EquipHand.BOTH
                ? Option.forName(
                    "main hand",
                    new OptionsBuilder(
                        "You must specify the action to take.",
                        ...mainOptions.map(option => option.prependSpace())
                    ))
                : undefined,
            Option.forName(
                "off hand",
                new OptionsBuilder(
                    "You must specify the action to take.",
                    ...offOptions.map(option => option.prependSpace())
                )
            ),
            CombatOption.forName(
                "rest",
                new UntargetedCombatAction(TurnAction.REST, 0, game => this.rest(game))
            ),
            CombatOption.forName(
                "wait",
                new UntargetedCombatAction(
                    TurnAction.NONE,
                    0,
                    () => undefined
                )
            )
        );
    }

    rest(game: Game) {
        const oldStamina = this.getStamina();
        this.increaseStamina(STAMINA_REST_AMOUNT);
        game.log(`You take a quick breather. Phew! You regained ${this.getStamina() - oldStamina} stamina.`);
    }

    usingFists(): boolean {
        return this.mainHand === this.fists;
    }

    equipOptions(): Option[] {
        return [
            ...this.getWeaponsInInventory().flatMap(weapon => {
                let applyAction: string | PureAction = "You must specify which hand to equip to.";
                let options: Option[] = [];

                if (weapon.hand === EquipHand.BOTH) {
                    applyAction = new PureAction(game => this.equipTwoHanded(weapon, game));
                } else if (weapon.hand === EquipHand.MAIN) {
                    applyAction = new PureAction(game => this.equipToMainHand(weapon, game));
                    options.push(...Option.forNames(
                        new PureAction(game => this.equipToMainHand(weapon, game)),
                        " to main hand", 
                        " main hand",
                    ));
                } else if (weapon.hand === EquipHand.OFF) {
                    applyAction = new PureAction(game => this.equipToOffHand(weapon, game));
                    options.push(...Option.forNames(
                        new PureAction(game => this.equipToOffHand(weapon, game)),
                        " to off hand", 
                        " off hand",
                    ));
                } else if (weapon.hand === EquipHand.ANY) {
                    options.push(...Option.forNames(
                        new PureAction(game => this.equipToMainHand(weapon, game)),
                        " to main hand", 
                        " main hand",
                    ));
                    options.push(...Option.forNames(
                        new PureAction(game => this.equipToOffHand(weapon, game)),
                        " to off hand", 
                        " off hand",
                    ));
                }

                if (weapon.hand === EquipHand.ANY && (!this.mainHand || this.mainHand?.hand === EquipHand.BOTH)) {
                    applyAction = new PureAction(game => this.equipToMainHand(weapon, game));
                } else if (weapon.hand === EquipHand.ANY && !this.offHand) {
                    applyAction = new PureAction(game => this.equipToOffHand(weapon, game));
                }

                return Option.forNames(
                    new EquipAction(applyAction, ...options),
                    ...weapon.pickupNames
                );
            }),
            ...!this.usingFists()
                ? Option.forNames(
                    new PureAction(game => this.equipTwoHanded(this.fists, game)),
                    ...this.fists.pickupNames)
                : []
        ];
    }

    unequipOptions(): Option[] {
        return [
            ...this.mainHand && !this.usingFists()
                ? Option.forNames(
                    new PureAction(game => this.unequipMainHand(game)),
                    " main hand",
                    ...this.mainHand.pickupNames)
                : [],
            ...this.offHand
                ? Option.forNames(
                    new PureAction(game => this.unequipOffHand(game)),
                    " off hand",
                    ...this.offHand.pickupNames)
                : []
        ];
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
            if (!this.usingFists()) {
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

    private getWeaponsInInventory() {
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
        game.log(`${this.name}
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
`${this.name}
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