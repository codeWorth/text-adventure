import { nonNull } from '../../util';
import ActionBuilder from '../userinput/actions/actionBuilder';
import ActionStart from '../userinput/actions/actionStart';
import LogAction from '../userinput/actions/logAction';
import Option from '../userinput/option';
import Game from './game';
import Connections from './rooms/connections';
const helloMsg = `Well ... hello there! Didn't think you'd get a response did you good sir. But alas, I am here. But I can't tell you much ... cause everything is a secret of course. Good day fair traveler! Best of luck to you!`;

class Room {
    public readonly name: string;
    public readonly connections: Connections;

    constructor(name: string) {
        this.name = name;
        this.connections = new Connections(this);
    }

    getOptions(game: Game): Option[] {
        return nonNull(
            this.connections.getGoOption(), 
            Option.forName("hello", new LogAction(helloMsg))
        );
    }

    getActions(game: Game): ActionBuilder {
        return new ActionStart(...this.getOptions(game));
    }
};

export default Room;