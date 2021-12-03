import { useEffect, useRef, useState } from 'react';
import './App.css';
import { NO_ACTION } from './model/actions/actionBuilder';
import Game from './model/game';
import parseInput from './model/input';
import Option from './model/option';
import Action from './model/actions/action';
import useStateRef from './useStateRef';

function App() {
    const textInput = useRef<HTMLInputElement>(null);
    const [inputFocused, setInputFocused] = useState(false);
    const [textInputContent, _setTextInputContent] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [historyEntries, setHistoryEntries, historyEntriesRef] = useStateRef<string[]>([]);
    const scrollDiv = useRef<HTMLDivElement>(null);

    const game = useRef(new Game(addHistoryEntry));
    const option = useRef<Option | null>(null);

    useEffect(() => scrollDiv.current?.scrollIntoView({behavior: "smooth"}), [historyEntries]);

    function addHistoryEntry(entry: string) {
        if (historyEntriesRef.current) {
            setHistoryEntries([...historyEntriesRef.current, entry]);
        } else {
            setHistoryEntries([entry]);
        }
    }

    function setTextInputContext(content: string) {
        if (content !== textInputContent) {
            const options = parseInput(content, game.current);
            if (options.length === 1) {
                option.current = options[0];
                setSuggestion(option.current.name.substring(option.current.consumed));
            } else {
                option.current = null;
                setSuggestion("");
            }
        }
        _setTextInputContent(content);
    }

    function keyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Tab") {
            if (option.current !== null) {
                const staticContent = textInputContent.substring(0, textInputContent.length - option.current.consumed);
                _setTextInputContent(staticContent + option.current.name);
                setSuggestion("");
            }
            event.preventDefault();
        } else if (event.key === "Enter" && textInputContent.length > 0) {
            const action: Action | undefined = option.current?.actionBuilder.build();
            if (action !== undefined && action !== NO_ACTION) {
                action.apply(game.current);
            } else {
                addHistoryEntry(`Unknown command: ${textInputContent}`);
            }
            setTextInputContext("");
            setSuggestion("");
            event.preventDefault();
        }
    }

    return (
        <>
            <div id="history">
                {historyEntries.map((entry, index) => 
                    <div className="history-entry" key={index}>{entry}</div>)
                }
                <div ref={scrollDiv}></div>
            </div>
            <div id="input-container">
                <input 
                    id="input-box"
                    value={textInputContent}
                    onInput={e => setTextInputContext(e.currentTarget.value)}
                    className={inputFocused ? "focused" : ""}
                    onClick={() => textInput.current?.focus()}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    onKeyDown={keyDown}
                    spellCheck={false}/>
                <div id="suggestion-container">
                    <span id="calcWidth">{textInputContent}</span>
                    <span  id="suggestion" spellCheck={false}>{suggestion}</span>
                </div>
            </div>
        </>
    );
}

export default App;
