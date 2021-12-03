import { ActionBuilder } from './actions/actionBuilder';
import { BaseBuilder } from './actions/actionBuilders';
import Game from './game';
import Option from './option';

const baseBuilder = new BaseBuilder();

function exactPrefixMatch(str: string, prefix: string): boolean {
    if (prefix.length > str.length) return false;
    return str.substring(0, prefix.length) === prefix;
}

function parseInput(input: string, game: Game, actionBuilder: ActionBuilder = baseBuilder): Option[] {
    const context = actionBuilder.context(game);
    input = input.toLowerCase();
    const matches = context.filter(option => exactPrefixMatch(input, option.name));

    if (matches.length === 1) {
        const match = matches[0];
        return parseInput(input.substring(match.name.length), game, match.actionBuilder);
    }

    return context
        .filter(option => exactPrefixMatch(option.name, input))
        .map(match => match.withConsumed(input.length));
}

export default parseInput;