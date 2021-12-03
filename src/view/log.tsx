import './log.css';
import { useEffect, useRef } from "react";

type LogProps = {
    entries: string[],
    errorMessage: string
};

const Log = (props: LogProps) => {
    const scrollDiv = useRef<HTMLDivElement>(null);

    useEffect(
        () => scrollDiv.current?.scrollIntoView({behavior: "smooth"}), 
        [props.entries]);

    return (
        <div id="history">
            {props.entries.map((entry, index) => 
                <div className="history-entry" key={index}>{entry}</div>)
            }
            {props.errorMessage.length > 0 && <div className="history-entry">{props.errorMessage}</div>}
            <div ref={scrollDiv}></div>
        </div>
    )
}

export default Log;