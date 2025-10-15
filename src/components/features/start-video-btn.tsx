"use client"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner";
import { useMediaDevicesProvider } from "../hooks/use-media-devices"
import { MediaControlView } from "../views/media-control-view";
import { useState, useCallback } from "react";
import { cn } from "../lib/utils";


type Props = {
    className?: string;
}

export function StartVideoBtn({ className }: Props) {
    const { setMediaStream, stream, waiting, isVideoReady, isAudioReady } = useMediaDevicesProvider();
    const [setup, setSetup] = useState<{ video: boolean; audio: boolean }>({ video: true, audio: true });

    const handleSwitchAudio = useCallback((enabled: boolean) => {
        setSetup(prev => ({ ...prev, audio: enabled }));
        setMediaStream({ audio: enabled });
    }, [setMediaStream]);

    const handleSwitchVideo = useCallback((enabled: boolean) => {
        setSetup(prev => ({ ...prev, video: enabled }));
        setMediaStream({ video: enabled });
    }, [setMediaStream]);

    const handleStart = useCallback(() => {
        setMediaStream({ video: setup.video, audio: setup.audio });
    }, [setup, setMediaStream]);

    const handleStop = useCallback(() => {
        setMediaStream({ video: false, audio: false });
    }, [setMediaStream]);

    const message = waiting ? "Starting..." : (stream ? "Stop" : "Start");
    const colorClass = waiting ? "bg-muted-foreground" : (stream ? "bg-chart-1 hover:bg-chart-1" : "bg-chart-2 hover:bg-chart-2");

    return (
        <div className={cn("flex gap-4 items-center border shadow-lg/5 rounded-full p-1 w-fit bg-background", className)}>

            <MediaControlView
                audioEnabled={setup.audio}
                videoEnabled={setup.video}
                onAudioToggle={handleSwitchAudio}
                onVideoToggle={handleSwitchVideo}
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
