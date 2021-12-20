import BasicNormalWeapon from "./basicNormalWeapon";

class Torch extends BasicNormalWeapon {

    constructor(name: string, pickupNames: string[]) {
        super(name, pickupNames, 1, 2);
    }

    canMainHand(): boolean {
        return true;
    }

    canOffHand(): boolean {
        return true;
    }
}

export default Torch;