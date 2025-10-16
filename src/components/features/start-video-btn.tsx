"use client"
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useMediaDevicesProvider } from "../hooks/use-media-devices";
import { MediaSwitch } from "../views/media-switch";
import { useCallback, useState } from "react";
import { cn } from "../lib/utils";
import { Radio } from "lucide-react";

type Props = {
    className?: string;
}

export function StartVideoBtn({ className }: Props) {
    const {
        startMediaStream,
        stopMediaStream,
        setAudioEnabled,
        setVideoEnabled,
        preferences,
        waiting,
    } = useMediaDevicesProvider();
    const [isActive, setIsActive] = useState(false);

    const handleStart = useCallback(() => {
        setIsActive(true);
        void startMediaStream({
            video: preferences.video ? { facingMode: "user" } : false,
            audio: preferences.audio ? true : false,
        }).catch(() => setIsActive(false));
    }, [preferences, startMediaStream]);

    const handleStop = useCallback(() => {
        setIsActive(false);
        stopMediaStream();
    }, [stopMediaStream]);

    const handleAudioToggle = useCallback((enabled: boolean) => {
        setAudioEnabled(enabled, true);
    }, [setAudioEnabled]);

    const handleVideoToggle = useCallback((enabled: boolean) => {
        setVideoEnabled(enabled, { facingMode: "user" });
    }, [setVideoEnabled]);


    const message = waiting ? (isActive ? "Updating..." : "Starting...") : (isActive ? "Stop" : "Start streaming");
    const colorClass = waiting ? "bg-muted-foreground" : (isActive ? "bg-chart-1 hover:bg-chart-1" : "bg-chart-2 hover:bg-chart-2");

    return (
        <div className={cn("flex gap-4 items-center border shadow-lg/5 rounded-full p-1 w-fit bg-background", className)}>

            <MediaSwitch
                type="video"
                enabled={preferences.video}
                onChange={handleVideoToggle}
                className="ml-3"
            />
            <MediaSwitch
                type="audio"
                enabled={preferences.audio}
                onChange={handleAudioToggle}
            />

            <Button
                onClick={isActive ? handleStop : handleStart}
                disabled={waiting}
                title={isActive ? "Stop Video" : "Start Video"}
                className={cn("rounded-full hover:brightness-110", colorClass)}
            >
                {waiting && <Spinner />}
                {!waiting && !isActive && <Radio />}
                {message}
            </Button>

        </div >
    );
}
