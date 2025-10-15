"use client"
import { useMediaDevices } from "../hooks/use-media-devices";
import { Bubble, BubbleProps } from "../views/bubble";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "../ui/spinner";
import { cn } from "../lib/utils";
import { AudioLines } from "lucide-react";

export type VideoBubbleProps = Omit<BubbleProps, "children">;

export function VideoBubble({ size, className }: VideoBubbleProps) {
    const { stream } = useMediaDevices();
    const [isReady, setIsReady] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        setIsReady(false);
        if (!videoRef.current) {
            return;
        }
        videoRef.current.srcObject = stream ?? null;
    }, [stream]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }

        const handleReady = () => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                setIsReady(true);
            }
        };

        video.addEventListener("loadeddata", handleReady);
        video.addEventListener("playing", handleReady);

        if (video.videoWidth > 0 && video.videoHeight > 0) {
            setIsReady(true);
        }

        return () => {
            video.removeEventListener("loadeddata", handleReady);
            video.removeEventListener("playing", handleReady);
        };
    }, [stream]);

    if (!stream) {
        return null;
    }

    return (
        <Bubble
            size={size}
            badge={<AudioLines className="h-4 w-4" />}
            className={cn("relative animate-bubble-pop", className)}
        >
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={cn("h-full w-full object-cover", !isReady && "opacity-0")}
            />
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner className="h-6 w-6 text-muted-foreground" />
                </div>
            )}
        </Bubble>
    );
}
