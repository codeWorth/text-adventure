import Item from "../item";

class Key extends Item {
    constructor(name: string, ...pickupNames: string[]) {
        super(name, ...pickupNames);
    }
}

export default Key;