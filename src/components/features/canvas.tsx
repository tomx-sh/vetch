"use client";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    {
        ssr: false,
    },
);

const Footer = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Footer,
    {
        ssr: false,
    },
);

type Props = {
    footer?: React.ReactNode;
    className?: string;
}


/**
 * Note: The footer className has been overridden in globals.css
 */
export function Canvas({ className, footer }: Props) {
    return (
        <div className={className + " custom-styles"}>
            <Excalidraw>
                <Footer>
                    <div className="flex justify-center w-full">
                        {footer}
                    </div>
                </Footer>
            </Excalidraw>
        </div>
    );
}