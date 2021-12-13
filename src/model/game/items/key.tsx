import Item from "../item";

type KeyParameters = {
    name: string, 
    pickupNames: string[], 
    openMessage?: string, 
    lockedMessage?: string
};

class Key extends Item {
    public readonly openMessage: string;
    public readonly lockedMessage: string;

    constructor({name, pickupNames, openMessage, lockedMessage}: KeyParameters) {
        super(name, pickupNames);
        this.openMessage = openMessage ? openMessage : `You unlock the door with the ${name}.`;
        this.lockedMessage = lockedMessage ? lockedMessage : "This door is locked."
    }
}

export default Key;