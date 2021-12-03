import ActionBuilder from './actions/actionBuilder';
import { BaseBuilder } from './actions/actionBuilders';
import Game from '../game/game';
import Option from './option';

const baseBuilder = new BaseBuilder();

enum ParseResponseType {
    SUGGESTIONS, RESULT
};

interface ParseResponse {
    readonly type: ParseResponseType;
}

class Suggestions implements ParseResponse {
    readonly type = ParseResponseType.SUGGESTIONS;
    readonly options: Option[];

    constructor(options: Option[]) {
        this.options = options;
    }
};

class Result implements ParseResponse {
    readonly type = ParseResponseType.RESULT;
    readonly result: ActionBuilder;

    constructor(result: ActionBuilder) {
        this.result = result;
    }
};

function exactPrefixMatch(str: string, prefix: string): boolean {
    if (prefix.length > str.length) return false;
    return str.substring(0, prefix.length) === prefix;
}

function parseInput(input: string, game: Game, actionBuilder: ActionBuilder = baseBuilder): Suggestions | Result {
    const context = actionBuilder.context(game);
    input = input.toLowerCase();
    const matches = context.filter(option => exactPrefixMatch(input, option.name));

    if (matches.length === 1) {
        const match = matches[0];
        const remainingInput = input.substring(match.name.length);
        if (remainingInput.length === 0) {
            return new Result(match.actionBuilder);
        } else {
            return parseInput(remainingInput, game, match.actionBuilder);
        }
    }

    return new Suggestions(context
        .filter(option => exactPrefixMatch(option.name, input))
        .map(match => match.withConsumed(input.length)));
}

export { ParseResponseType, parseInput };