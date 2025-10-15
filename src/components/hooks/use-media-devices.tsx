'use client'
import { useState, useContext, createContext, useCallback } from "react";

type Constraints = {
    video: boolean;
    audio: boolean;
};

type MediaDevicesControl = {
    open: (constraints: Constraints) => void;
    close: () => void;
    stream: MediaStream | null;
    waiting: boolean;
    error: Error | null;
};

function useMediaDevicesController(): MediaDevicesControl {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [waiting, setWaiting] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const open = useCallback((constraints: Constraints) => {
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
    }, []);

    const close = useCallback(() => {
        if (stream !== null) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    return { open, close, stream, waiting, error };
}


const MediaDevicesContext = createContext<MediaDevicesControl | null>(null);

export function MediaDevicesProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const controller = useMediaDevicesController();
    return (
        <MediaDevicesContext.Provider value={controller}>
            {children}
        </MediaDevicesContext.Provider>
    );
}

export function useMediaDevices() {
    const context = useContext(MediaDevicesContext);
    if (!context) {
        throw new Error("useMediaDevices must be used within a MediaDevicesProvider");
    }
    return context;
}