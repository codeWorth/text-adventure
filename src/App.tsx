import { useEffect, useRef, useState } from 'react';
import './App.css';
import Game from './model/game/game';
import PlayerConfig from './model/playerConfig';
import { parseInput, ParseResponseType } from './model/userinput/input';
import useStateRef from './useStateRef';
import InputBox from './view/inputBox';
import Log from './view/log';

enum GameScreen {
    SETUP, GAMEPLAY
};

function App() {
    const [inputContent, _setInputContent] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [logEntries, setLogEntries, logEntriesRef] = useStateRef<string[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const gameScreen = useRef(GameScreen.SETUP);
    const playerSetup = useRef(new PlayerConfig());
    const game = useRef<Game | null>(null);

    useEffect(() => {
        log(playerSetup.current.promptMessage());
    }, []);

    function log(message: string) {
        setErrorMessage("");
        if (logEntriesRef.current) {
            setLogEntries([...logEntriesRef.current, message]);
        } else {
            setLogEntries([message]);
        }
    }

    function error(message: string) {
        setErrorMessage(message);
    }

    function setInputContent(content: string) {
        if (content !== inputContent && gameScreen.current === GameScreen.GAMEPLAY && game.current !== null) {
            const parsed = parseCurrentInput(content, game.current);
            if (parsed.type === ParseResponseType.SUGGESTIONS && parsed.options.length === 1) {
                const option = parsed.options[0];
                setSuggestion(option.name.substring(option.consumed));
            } else {
                setSuggestion("");
            }
        }
        _setInputContent(content);
    }

    function keyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Tab") {
            handleTab(inputContent);
            event.preventDefault();
        } else if (event.key === "Enter") {
            handleEnter(inputContent);
            event.preventDefault();
        }
    }

    function handleEnter(message: string) {
        if (gameScreen.current === GameScreen.SETUP) {
            playerSetup.current.consumeInput(message);
            _setInputContent("");
            if (playerSetup.current.isFinished()) {
                setLogEntries([]);
                game.current = new Game(log, error, playerSetup.current);
                gameScreen.current = GameScreen.GAMEPLAY;
            } else {
                log(playerSetup.current.promptMessage());
            }
        } else if (gameScreen.current === GameScreen.GAMEPLAY && game.current !== null) {
            const parsed = parseCurrentInput(message, game.current);
            if (parsed.type === ParseResponseType.RESULT) {
                parsed.result.apply(game.current);
            } else {
                error(`Unknown command: ${message}`);
            }
            _setInputContent("");
            setSuggestion("");
        }
    }

    function handleTab(message: string) {
        if (gameScreen.current === GameScreen.GAMEPLAY && game.current !== null) {
            const parsed = parseCurrentInput(message, game.current);
            if (parsed.type === ParseResponseType.SUGGESTIONS && parsed.options.length === 1) {
                const option = parsed.options[0];
                const staticContent = message.substring(0, message.length - option.consumed);
                _setInputContent(staticContent + option.name);
                setSuggestion("");
            }
        }
    }

    function parseCurrentInput(message: string, game: Game) {
        return parseInput(message.trim(), game.getCurrentRoom().getActions(game));
    }

    return (
        <>
            <Log 
                entries={logEntries}
                errorMessage={errorMessage}/>
            <InputBox 
                value={inputContent} 
                suggestion={suggestion}
                setValue={setInputContent}
                keyDown={keyDown}/>
        </>
    );
}

export default App;
