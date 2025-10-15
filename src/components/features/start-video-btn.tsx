"use client"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner";
import { useMediaDevices } from "../hooks/use-media-devices"
import { MediaControlView } from "../views/media-control-view";
import { useState } from "react";
import { cn } from "../lib/utils";


type Props = {
    className?: string;
}

export function StartVideoBtn({ className }: Props) {
    const { open, close, stream, waiting } = useMediaDevices();

    const [audioEnabled, setAudioEnabled] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(false);

    const handleStart = () => { open({ video: true, audio: false }) };
    const handleStop = () => { close() };

    const message = waiting ? "Starting..." : (stream ? "Stop" : "Start");
    const colorClass = waiting ? "bg-muted-foreground" : (stream ? "bg-chart-1 hover:bg-chart-1" : "bg-chart-2 hover:bg-chart-2");

    return (
        <div className={cn("flex gap-4 items-center border shadow-lg/5 rounded-full p-1 w-fit", className)}>

            <MediaControlView
                audioEnabled={audioEnabled}
                videoEnabled={videoEnabled}
                onAudioToggle={setAudioEnabled}
                onVideoToggle={setVideoEnabled}
                className="pl-2"
            />


            <Button
                onClick={stream ? handleStop : handleStart}
                disabled={waiting}
                title={stream ? "Stop Video" : "Start Video"}
                className={cn("rounded-full hover:brightness-110", colorClass)}
            >
                {waiting && <Spinner />}
                {message}
            </Button>

        </div >
    );
}
