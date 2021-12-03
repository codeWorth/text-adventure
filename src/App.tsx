import { useEffect, useRef, useState } from 'react';
import './App.css';
import Game from './model/game';
import { parseInput, ParseResponseType } from './model/input';
import useStateRef from './useStateRef';

function App() {
    const textInput = useRef<HTMLInputElement>(null);
    const [inputFocused, setInputFocused] = useState(false);
    const [textInputContent, _setTextInputContent] = useState("");
    const [suggestion, setSuggestion] = useState("");
    const [historyEntries, setHistoryEntries, historyEntriesRef] = useStateRef<string[]>([]);
    const scrollDiv = useRef<HTMLDivElement>(null);

    const game = useRef(new Game(addHistoryEntry));

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
            const parsed = parseInput(content.trim(), game.current);
            if (parsed.type === ParseResponseType.SUGGESTIONS && parsed.options.length === 1) {
                const option = parsed.options[0];
                setSuggestion(option.name.substring(option.consumed));
            } else {
                setSuggestion("");
            }
        }
        _setTextInputContent(content);
    }

    function keyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Tab") {
            const parsed = parseInput(textInputContent.trim(), game.current);
            if (parsed.type === ParseResponseType.SUGGESTIONS && parsed.options.length === 1) {
                const option = parsed.options[0];
                const staticContent = textInputContent.substring(0, textInputContent.length - option.consumed);
                _setTextInputContent(staticContent + option.name);
                setSuggestion("");
            }
            event.preventDefault();
        } else if (event.key === "Enter" && textInputContent.length > 0) {
            const parsed = parseInput(textInputContent.trim(), game.current);
            if (parsed.type === ParseResponseType.RESULT) {
                parsed.result.apply(game.current);
            } else {
                addHistoryEntry(`Unknown command: ${textInputContent}`);
            }
            setTextInputContext("");
            setSuggestion("");
            event.preventDefault();
        }
    }

    return (
        <div id="container">
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
        </div>
    );
}

export default App;
