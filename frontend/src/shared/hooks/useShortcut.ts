import React from "react";
import { useEffect } from "react";

export const useShortcut = (key: string, callback: () => void) => {
    const callbackRef = React.useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === key) {
                event.preventDefault();
                callbackRef.current();
            }
        };


        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };

    }, [key]);
    
  

}