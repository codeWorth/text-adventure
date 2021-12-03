import { useRef, useState } from 'react';
import './App.css';
import Game from './model/game';
import { parseInput, ParseResponseType } from './model/userinput/input';
import useStateRef from './useStateRef';
import InputBox from './view/inputBox';
import Log from './view/log';

function App() {
    const [inputContent, _setInputContent] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [logEntries, setLogEntries, logEntriesRef] = useStateRef<string[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const game = useRef(new Game(log, error));

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

    function setTextInputContext(content: string) {
        if (content !== inputContent) {
            const parsed = parseInput(content.trim(), game.current);
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
            const parsed = parseInput(inputContent.trim(), game.current);
            if (parsed.type === ParseResponseType.SUGGESTIONS && parsed.options.length === 1) {
                const option = parsed.options[0];
                const staticContent = inputContent.substring(0, inputContent.length - option.consumed);
                _setInputContent(staticContent + option.name);
                setSuggestion("");
            }
            event.preventDefault();
        } else if (event.key === "Enter" && inputContent.length > 0) {
            const parsed = parseInput(inputContent.trim(), game.current);
            if (parsed.type === ParseResponseType.RESULT) {
                parsed.result.apply(game.current);
            } else {
                error(`Unknown command: ${inputContent}`);
            }
            setTextInputContext("");
            setSuggestion("");
            event.preventDefault();
        }
    }

    return (
        <>
            <Log 
                entries={logEntries}
                errorMessage={errorMessage}/>
            <InputBox 
                value={inputContent} 
                suggestion={suggestion}
                setValue={setTextInputContext}
                keyDown={keyDown}/>
        </>
    );
}

export default App;
