import { useCallback, useRef, useState } from "react";

function useStateRef<T>(initialState: T): [T, React.Dispatch<React.SetStateAction<T>>, React.RefObject<T>] {
    const [state, setState] = useState(initialState);
    const ref = useRef(state);

    const modUseState = useCallback((obj) => {
        // react allows user to pass function or value directly to useState
        ref.current = typeof obj === "function" ? obj(ref.current) : obj;
        setState(ref.current);
    }, []);

    return [state, modUseState, ref];
  };

  export default useStateRef;