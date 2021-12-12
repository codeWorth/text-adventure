import { nonNull } from '../../util';
import ActionBuilder from '../userinput/actions/actionBuilder';
import ActionStart from '../userinput/actions/actionStart';
import Option from '../userinput/option';
import Game from './game';
import Connections from './rooms/connections';

class Room {
    public readonly name: string;
    public readonly connections: Connections;

    constructor(name: string) {
        this.name = name;
        this.connections = new Connections(this);
    }

    getOptions(game: Game): Option[] {
        return nonNull(this.connections.getGoOption());
    }

    getActions(game: Game): ActionBuilder {
        return new ActionStart(...this.getOptions(game));
    }
};

export default Room;