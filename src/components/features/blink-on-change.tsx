"use client"
import { useEffect, useState } from "react";
import { useCanvasApi } from "./canvas"


/**
 * Blinking dot when canvas changes
 */
export function BlinkOnChange() {
    const { canvasApi } = useCanvasApi();
    const [blink, setBlink] = useState(false);

    useEffect(() => {
        if (!canvasApi) return;

        const handleChange = () => {
            setBlink(true);
            setTimeout(() => setBlink(false), 300); // Blink duration
        };

        const unsub = canvasApi.onChange(handleChange);

        return () => {
            unsub();
        };
    }, [canvasApi]);

    return (
        <div className={`h-3 w-3 rounded-full ${blink ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
    );
}