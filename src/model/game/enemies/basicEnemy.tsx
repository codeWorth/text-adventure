import Game from "../game";
import NormalWeapon from "../items/normalWeapon";
import { TurnAction } from "../items/weapon";
import Enemy from "./enemy";

class BasicEnemy extends Enemy {

    constructor(name: string, maxHealth: number, maxStamina: number, weapon: NormalWeapon) {
        super(name, maxHealth, maxStamina);
        this.mainHand = weapon;
    }

    protected decideAction(game: Game): TurnAction {
        if (this.getStamina() >= (this.mainHand as NormalWeapon).stamina) {
            return TurnAction.NORMAL_ATTACK;
        } else {
            return TurnAction.REST;
        }
    }

    executeTurn(playerAction: TurnAction, game: Game): void {
        const weapon = this.mainHand as NormalWeapon;
        const action = this.turnAction(game);

        if (action === TurnAction.REST) {
            this.rest(game);
        } else if (action === TurnAction.NORMAL_ATTACK) {
            weapon.attack(this, game.player, playerAction, game, [playerAction]);
        }
    }
}

export default BasicEnemy;