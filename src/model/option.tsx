import ActionBuilder from "./actions/actionBuilder";

class Option {
    public readonly name: string;
    public readonly actionBuilder: ActionBuilder;
    public readonly consumed: number;

    private constructor(name: string, actionBuilder: ActionBuilder, consumed: number) {
        this.name = name;
        this.actionBuilder = actionBuilder;
        this.consumed = consumed;
    }

    public withConsumed(consumed: number) {
        return new Option(this.name, this.actionBuilder, consumed);
    }

    public static forAction(name: string, actionBuilder: ActionBuilder) {
        return new Option(name, actionBuilder, 0);
    }
};

export default Option;