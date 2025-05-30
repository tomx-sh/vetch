"use client"
import { useState } from "react";
import VideoBubble from "./VideoBubble";
import { Button } from "./ui/button";


function useOpenMediaDevices(): {
    open: (constraints: {
        video: boolean;
        audio: boolean;
    }) => void;
    close: () => void;
    stream: MediaStream | null;
    waiting: boolean;
    error: Error | null;
} {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [waiting, setWaiting] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    function open(constraints: {
        video: boolean;
        audio: boolean;
    }) {
        setWaiting(true);
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                setStream(stream);
                setWaiting(false);
            })
            .catch(error => {
                setError(error);
                setWaiting(false);
            });
    }

    function close() {
        if (stream !== null) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }

    return { open, close, stream, waiting, error };
}



export default function VideoBtn() {
    const { open, close, stream, waiting, error } = useOpenMediaDevices();

    return (
        <div>
            {error !== null && <p>{error.message}</p>}
                
            <Button
                onClick={() => open({ video: true, audio: false })}
                disabled={waiting || stream !== null}
            >
                Video
            </Button>

            <Button
                onClick={close}
                disabled={waiting || stream === null}
            >
                Stop
            </Button>

            <VideoBubble
                stream={stream}
                loading={waiting}
                className="fixed bottom-4 right-4 w-36 h-36"
            />
            

        </div>

    );
}



