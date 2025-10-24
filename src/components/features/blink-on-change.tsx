"use client"
import { useEffect, useState, useCallback } from "react";
import { useCanvasApi, ExcalidrawElement, AppState, BinaryFiles } from "./canvas"


/**
 * Blinking dot when canvas changes
 */
export function BlinkOnChange() {
    const { canvasApi } = useCanvasApi();
    const [blink, setBlink] = useState(false);

    const handleChange = useCallback((elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
        setBlink(true);
        console.log("AppState changed:", appState);
        console.log("Elements changed:", elements);
        setTimeout(() => setBlink(false), 300); // Blink duration
    }, []);

    useEffect(() => {
        if (!canvasApi) return;
        const unsub = canvasApi.onChange(handleChange);
        return () => { unsub() };
    }, [canvasApi]);

    return (
        <div className={`h-3 w-3 rounded-full ${blink ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
    );
}