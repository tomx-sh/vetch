'use client'
import { useState, useContext, createContext, useCallback, useMemo, useEffect, useRef } from "react";


type ConstraintValue = boolean | MediaTrackConstraints;

type ConstraintState = {
    audio: ConstraintValue;
    video: ConstraintValue;
};

type MediaDevicesControl = {
    setMediaStream: (constraints: Partial<MediaStreamConstraints>) => void;
    isVideoReady: boolean;
    isAudioReady: boolean;
    stream: MediaStream | null;
    waiting: boolean;
    error: Error | null;
};

const defaultConstraints: ConstraintState = { audio: false, video: false };

const isConstraintActive = (value: ConstraintValue): boolean => {
    if (typeof value === "boolean") {
        return value;
    }
    return value !== undefined;
};

const stopTracks = (stream: MediaStream | null) => {
    stream?.getTracks().forEach(track => track.stop());
};

function useMediaDevices(): MediaDevicesControl {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [waiting, setWaiting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [constraints, setConstraints] = useState<ConstraintState>(defaultConstraints);
    const streamRef = useRef<MediaStream | null>(null);

    const isVideoReady = useMemo(() => stream?.getVideoTracks().some(track => track.readyState === "live") ?? false, [stream]);
    const isAudioReady = useMemo(() => stream?.getAudioTracks().some(track => track.readyState === "live") ?? false, [stream]);

    const setMediaStream = useCallback((incoming: Partial<MediaStreamConstraints>) => {
        setConstraints(prev => {
            const next: ConstraintState = {
                audio: incoming.audio ?? prev.audio,
                video: incoming.video ?? prev.video,
            };

            if (Object.is(prev.audio, next.audio) && Object.is(prev.video, next.video)) {
                return prev;
            }

            return next;
        });
    }, []);

    useEffect(() => {
        let cancelled = false;
        const wantsAudio = isConstraintActive(constraints.audio);
        const wantsVideo = isConstraintActive(constraints.video);

        const clearCurrentStream = () => {
            stopTracks(streamRef.current);
            streamRef.current = null;
            setStream(null);
        };

        if (!wantsAudio && !wantsVideo) {
            clearCurrentStream();
            setWaiting(false);
            setError(null);
            return;
        }

        const requestStream = async () => {
            setWaiting(true);
            setError(null);
            clearCurrentStream();

            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    audio: wantsAudio ? constraints.audio : false,
                    video: wantsVideo ? constraints.video : false,
                });

                if (cancelled) {
                    stopTracks(newStream);
                    return;
                }

                streamRef.current = newStream;
                setStream(newStream);
            } catch (err) {
                if (!cancelled) {
                    clearCurrentStream();
                    setError(err instanceof Error ? err : new Error("Unable to access media devices"));
                }
            } finally {
                if (!cancelled) {
                    setWaiting(false);
                }
            }
        };

        requestStream();

        return () => {
            cancelled = true;
        };
    }, [constraints]);

    useEffect(() => {
        return () => {
            stopTracks(streamRef.current);
        };
    }, []);

    return { setMediaStream, stream, waiting, error, isVideoReady, isAudioReady };
}


const MediaDevicesContext = createContext<MediaDevicesControl | null>(null);

export function MediaDevicesProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const controller = useMediaDevices();
    return (
        <MediaDevicesContext.Provider value={controller}>
            {children}
        </MediaDevicesContext.Provider>
    );
}

export function useMediaDevicesProvider() {
    const context = useContext(MediaDevicesContext);
    if (!context) {
        throw new Error("useMediaDevices must be used within a MediaDevicesProvider");
    }
    return context;
}