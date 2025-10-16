"use client";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";
const Excalidraw = dynamic(async () => (await import("@excalidraw/excalidraw")).Excalidraw, { ssr: false });
const Footer = dynamic(async () => (await import("@excalidraw/excalidraw")).Footer, { ssr: false });
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { useState, useContext, createContext, JSX } from "react";


type Props = {
    footer?: React.ReactNode;
    topRight?: JSX.Element;
    className?: string;
}


/**
 * Note: classNames have been overridden in globals.css
 */
export function Canvas({ footer, topRight, className }: Props) {
    const { setCanvasApi } = useCanvasApi();

    return (
        <div className={className + " custom-styles"}>
            <Excalidraw
                excalidrawAPI={setCanvasApi}
                renderTopRightUI={topRight ? () => topRight : undefined}
            >
                <Footer>
                    <div className="flex justify-center w-full">
                        {footer}
                    </div>
                </Footer>
            </Excalidraw>
        </div>
    );
}


const CanvasApiContext = createContext<{
    canvasApi: ExcalidrawImperativeAPI | null;
    setCanvasApi: (api: ExcalidrawImperativeAPI | null) => void;
} | null>(null);


export function CanvasApiProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [canvasApi, setCanvasApi] = useState<ExcalidrawImperativeAPI | null>(null);
    return (
        <CanvasApiContext.Provider value={{ canvasApi, setCanvasApi }}>
            {children}
        </CanvasApiContext.Provider>
    );
}

export function useCanvasApi() {
    const context = useContext(CanvasApiContext);
    if (context === null) {
        throw new Error("useCanvasApi must be used within a CanvasApiProvider");
    }
    return context;
}