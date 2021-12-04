class Item {
    public readonly name: string;
    public readonly pickupNames: string[];

    constructor(name: string, pickupNames: string[]) {
        this.name = name;
        this.pickupNames = Array.from(new Set([name, ...pickupNames]));
    }
};

export default Item;