import './inputBox.css';

type InputBoxProps = {
    value: string,
    suggestion: string,
    setValue: (value: string) => void,
    keyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
};

const InputBox = (props: InputBoxProps) => {
    return (
        <div id="input-container">
            <span id="caret">&gt;</span>
            <input 
                autoFocus
                id="input-box"
                value={props.value}
                onInput={e => props.setValue(e.currentTarget.value)}
                onKeyDown={props.keyDown}
                spellCheck={false}/>
            <div id="suggestion-container">
                <span id="calcWidth">{props.value}</span>
                <span  id="suggestion" spellCheck={false}>{props.suggestion}</span>
            </div>
        </div>
    );
}

export default InputBox;