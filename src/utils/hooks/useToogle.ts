import { useCallback, useState } from "react";

export function useToggle(defaultState = false): [boolean, () => void, () => void, () => void, (state: boolean) => void] {
    const [state, setState] = useState<boolean>(defaultState);

    const setTrue = useCallback(() => setState(true), []);

    const setFalse = useCallback(() => setState(false), []);

    const toggle = useCallback(() => setState(!state), [state]);

    return [state, toggle, setTrue, setFalse, setState];
}
