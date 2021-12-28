import { requireOptional } from "../../../util";

export type ItemParams = {
    name: string;
    pickupNames: string[];
    lookMessage: string;
    pickupMessage?: string;  
};

export abstract class Item {
    public readonly name: string;
    public readonly pickupNames: string[];
    public readonly lookMessage: string;
    public readonly pickupMessage?: string;

    constructor(params: ItemParams) {
        this.name = params.name;
        this.pickupNames = Array.from(new Set(
            [params.name, ...params.pickupNames].map(name => " " + name.toLowerCase())
        ));
        this.lookMessage = params.lookMessage;
        this.pickupMessage = params.pickupMessage;
    }

    abstract details(): string;

    static itemBuilder(): ItemBuilder {
        return new ItemBuilder();
    }
};

class ItemBuilder {
    private _name?: string;
    private _pickupNames?: string[];
    private _lookMessage?: string;
    private _pickupMessage?: string;  

    name(name: string): ItemBuilder {
        this._name = name;
        return this;
    }

    pickupNames(...pickupNames: string[]): ItemBuilder {
        this._pickupNames = pickupNames;
        return this;
    }

    lookMessage(lookMessage: string): ItemBuilder {
        this._lookMessage = lookMessage;
        return this;
    }

    pickupMessage(pickupMessage: string): ItemBuilder {
        this._pickupMessage = pickupMessage;
        return this;
    }

    build(): ItemParams {
        requireOptional(this._name);
        requireOptional(this._pickupNames);
        requireOptional(this._lookMessage);
        return {
            name: this._name as string,
            pickupNames: this._pickupNames as string[],
            lookMessage: this._lookMessage as string,
            pickupMessage: this._pickupMessage
        };
    }
}