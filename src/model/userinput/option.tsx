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

    hasTerminal(): boolean {
        return this.actionBuilder.terminal() 
            || this.actionBuilder.context()
                .some(option => option.hasTerminal());
    }

    prependSpace(): Option {
        return new Option(" " + this.name, this.actionBuilder, this.consumed);
    }

    withConsumed(consumed: number) {
        return new Option(this.name, this.actionBuilder, consumed);
    }

    static forName(name: string, actionBuilder: ActionBuilder) {
        return new Option(name, actionBuilder, 0);
    }

    static forNames(actionBuilder: ActionBuilder, ...names: string[]) {
        return names.map(name => this.forName(name, actionBuilder));
    }
};

export default Option;