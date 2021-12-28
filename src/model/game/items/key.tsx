import { Item, ItemParams } from "./item";

export type KeyParams = {
    openMessage?: string, 
    lockedMessage: string,
    detailsMessage: string
};

export class Key extends Item {
    public readonly openMessage: string;
    public readonly lockedMessage: string;
    private readonly detailsMessage: string;

    constructor(itemParams: ItemParams, keyParams: KeyParams) {
        super(itemParams);
        this.openMessage = keyParams.openMessage || `You unlock the door with the ${itemParams.name}.`;
        this.lockedMessage = keyParams.lockedMessage;
        this.detailsMessage = keyParams.detailsMessage;
    }

    details(): string {
        return this.detailsMessage;
    }

    static keyBuilder(): KeyBuilder {
        return new KeyBuilder();
    }
}

class KeyBuilder {
    private _openMessage?: string;
    private _lockedMessage: string = "This door is locked.";
    private _detailsMessage: string = "A key to open a door.";

    openMessage(openMessage: string): KeyBuilder {
        this._openMessage = openMessage;
        return this;
    }

    lockedMessage(lockedMessage: string): KeyBuilder {
        this._lockedMessage = lockedMessage;
        return this;
    }

    detailsMessage(detailsMessage: string): KeyBuilder {
        this._detailsMessage = detailsMessage;
        return this;
    }

    build(): KeyParams {
        return {
            openMessage: this._openMessage,
            lockedMessage: this._lockedMessage,
            detailsMessage: this._detailsMessage
        };
    }
}