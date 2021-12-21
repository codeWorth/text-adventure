import { assertUnreachable } from "../../../util";
import Entity from "../entity";
import Game from "../game";
import NormalWeapon from "./normalWeapon";
import { EquipHand, TurnAction, WeaponType } from "./weapon";

class BasicNormalWeapon extends NormalWeapon {

    public damage: number;
    public stamina: number;

    constructor(name: string, pickupNames: string[], damage: number, stamina: number, hand?: EquipHand) {
        super(name, pickupNames, WeaponType.NORMAL, hand || EquipHand.ANY);
        this.damage = damage;
        this.stamina = stamina;
    }

    attack(source: Entity, target: Entity, targetAction: TurnAction, game: Game): void {
        switch (targetAction) {
            case TurnAction.NORMAL_ATTACK:
                this.doDirectAttack(this.damage, this.stamina, source, target, game);
                break;
            case TurnAction.LIGHT_ATTACK:
                this.doDirectAttack(this.damage, this.stamina, source, target, game);
                break;
            case TurnAction.HEAVY_ATTACK:
                this.doDirectAttack(this.damage, this.stamina, source, target, game);
                break;
            case TurnAction.REST:
                this.doDirectAttack(this.damage, this.stamina, source, target, game);
                break;
            case TurnAction.NONE:
                this.doDirectAttack(this.damage, this.stamina, source, target, game);
                break;
            case TurnAction.BASH:
                console.log("LMAO rolled");
                break;
            case TurnAction.PARRY:
                console.log("LMAO rolled");
                break;
            case TurnAction.BLOCK:
                console.log("LMAO rolled");
                break;
            default:
                assertUnreachable(targetAction);
        }
    }
}

export default BasicNormalWeapon;