import ActionBuilder from "./actions/actionBuilder";

class Option {
    public readonly name: string;
    public readonly actionBuilder: ActionBuilder;
    public readonly consumed: number;

    protected constructor(name: string, actionBuilder: ActionBuilder, consumed: number) {
        this.name = name.toLowerCase();
        this.actionBuilder = actionBuilder;
        this.consumed = consumed;
    }

    public withConsumed(consumed: number) {
        return new Option(this.name, this.actionBuilder, consumed);
    }

    public static forName(name: string, actionBuilder: ActionBuilder) {
        return new Option(name, actionBuilder, 0);
    }

    public static forNames(actionBuilder: ActionBuilder, ...names: string[]) {
        return names.map(name => this.forName(name, actionBuilder));
    }
};

export default Option;