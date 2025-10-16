'use client'
import { useState, useContext, createContext, useCallback, useEffect, useRef } from "react";

type TrackKind = "audio" | "video";
type MediaPreferences = Record<TrackKind, boolean>;
type MediaRequestOptions = Partial<Record<TrackKind, boolean | MediaTrackConstraints>>;

type MediaDevicesControl = {
    startMediaStream: (options?: MediaRequestOptions) => Promise<void>;
    stopMediaStream: () => void;
    setAudioEnabled: (enabled: boolean, constraintOverride?: boolean | MediaTrackConstraints) => void;
    setVideoEnabled: (enabled: boolean, constraintOverride?: boolean | MediaTrackConstraints) => void;
    preferences: MediaPreferences;
    stream: MediaStream | null;
    waiting: boolean;
    error: Error | null;
};

function stopTracks(stream: MediaStream | null) {
    stream?.getTracks().forEach(track => track.stop());
}

function useMediaDevices(): MediaDevicesControl {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [waiting, setWaiting] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [preferences, setPreferences] = useState<MediaPreferences>({ audio: true, video: true });

    const streamRef = useRef<MediaStream | null>(null);
    const startRequestIdRef = useRef(0);
    const trackRequestIdRef = useRef<Record<TrackKind, number>>({ audio: 0, video: 0 });
    const constraintRef = useRef<Record<TrackKind, boolean | MediaTrackConstraints>>({
        audio: true,
        video: { facingMode: "user" },
    });
    const pendingOpsRef = useRef(0);

    const beginWaiting = useCallback(() => {
        pendingOpsRef.current += 1;
        if (pendingOpsRef.current === 1) {
            setWaiting(true);
        }
    }, []);

    const endWaiting = useCallback(() => {
        if (pendingOpsRef.current === 0) {
            return;
        }
        pendingOpsRef.current -= 1;
        if (pendingOpsRef.current === 0) {
            setWaiting(false);
        }
    }, []);

    const publishStream = useCallback((source: MediaStream | null, clone = false) => {
        if (!source) {
            streamRef.current = null;
            setStream(null);
            return;
        }
        const next = clone ? new MediaStream(source.getTracks()) : source;
        streamRef.current = next;
        setStream(next);
    }, []);

    const updateConstraint = useCallback((kind: TrackKind, override?: boolean | MediaTrackConstraints) => {
        if (override !== undefined) {
            constraintRef.current[kind] = override;
        }
        return constraintRef.current[kind];
    }, []);

    const stopCurrentStream = useCallback(() => {
        trackRequestIdRef.current.audio += 1;
        trackRequestIdRef.current.video += 1;
        const current = streamRef.current;
        if (current) {
            stopTracks(current);
        }
        publishStream(null);
    }, [publishStream]);

    useEffect(() => {
        return () => {
            stopCurrentStream();
        };
    }, [stopCurrentStream]);

    const disableTrack = useCallback((kind: TrackKind) => {
        trackRequestIdRef.current[kind] += 1;
        const current = streamRef.current;
        if (!current) {
            return;
        }
        const tracks = kind === "audio" ? current.getAudioTracks() : current.getVideoTracks();
        if (!tracks.length) {
            return;
        }
        tracks.forEach(track => {
            track.stop();
            current.removeTrack(track);
        });
        publishStream(current, true);
    }, [publishStream]);

    const ensureTrack = useCallback(
        async (kind: TrackKind, constraintOverride?: boolean | MediaTrackConstraints) => {
            const current = streamRef.current;
            if (!current) {
                return;
            }

            const tracks = kind === "audio" ? current.getAudioTracks() : current.getVideoTracks();
            if (tracks.length > 0) {
                tracks.forEach(track => {
                    track.enabled = true;
                });
                publishStream(current, true);
                return;
            }

            const constraint = updateConstraint(kind, constraintOverride);
            if (constraint === false) {
                return;
            }

            const requestId = trackRequestIdRef.current[kind] + 1;
            trackRequestIdRef.current[kind] = requestId;
            beginWaiting();

            try {
                const extraStream = await navigator.mediaDevices.getUserMedia(
                    kind === "audio"
                        ? { audio: constraint, video: false }
                        : { audio: false, video: constraint }
                );

                if (trackRequestIdRef.current[kind] !== requestId || !streamRef.current) {
                    stopTracks(extraStream);
                    return;
                }

                const trackList = kind === "audio" ? extraStream.getAudioTracks() : extraStream.getVideoTracks();
                const track = trackList[0];
                if (!track) {
                    stopTracks(extraStream);
                    return;
                }

                const target = streamRef.current;
                if (!target) {
                    track.stop();
                    return;
                }

                target.addTrack(track);
                publishStream(target, true);
            } catch (err) {
                if (trackRequestIdRef.current[kind] !== requestId) {
                    return;
                }
                setError(err instanceof Error ? err : new Error("Unable to access media devices"));
            } finally {
                endWaiting();
            }
        },
        [beginWaiting, endWaiting, publishStream, updateConstraint]
    );

    const startMediaStream = useCallback(
        async (options?: MediaRequestOptions) => {
            const requestId = startRequestIdRef.current + 1;
            startRequestIdRef.current = requestId;

            setError(null);
            stopCurrentStream();

            const requestedAudio = updateConstraint("audio", options?.audio);
            const requestedVideo = updateConstraint("video", options?.video);
            const audioConstraint = preferences.audio ? requestedAudio : false;
            const videoConstraint = preferences.video ? requestedVideo : false;

            if (audioConstraint === false && videoConstraint === false) {
                publishStream(new MediaStream());
                return;
            }

            beginWaiting();
            try {
                const nextStream = await navigator.mediaDevices.getUserMedia({
                    audio: audioConstraint,
                    video: videoConstraint,
                });

                if (startRequestIdRef.current !== requestId) {
                    stopTracks(nextStream);
                    return;
                }

                publishStream(nextStream);
            } catch (err) {
                if (startRequestIdRef.current !== requestId) {
                    return;
                }
                setError(err instanceof Error ? err : new Error("Unable to access media devices"));
                publishStream(null);
            } finally {
                if (startRequestIdRef.current === requestId) {
                    endWaiting();
                }
            }
        },
        [beginWaiting, endWaiting, preferences.audio, preferences.video, publishStream, stopCurrentStream, updateConstraint]
    );

    const stopMediaStream = useCallback(() => {
        startRequestIdRef.current += 1;
        stopCurrentStream();
        pendingOpsRef.current = 0;
        setWaiting(false);
    }, [stopCurrentStream]);

    const setAudioEnabled = useCallback(
        (enabled: boolean, constraintOverride?: boolean | MediaTrackConstraints) => {
            setPreferences(prev => (prev.audio === enabled ? prev : { ...prev, audio: enabled }));

            if (!streamRef.current) {
                if (enabled) {
                    updateConstraint("audio", constraintOverride);
                }
                return;
            }

            if (enabled) {
                ensureTrack("audio", constraintOverride);
            } else {
                disableTrack("audio");
            }
        },
        [disableTrack, ensureTrack, updateConstraint]
    );

    const setVideoEnabled = useCallback(
        (enabled: boolean, constraintOverride?: boolean | MediaTrackConstraints) => {
            setPreferences(prev => (prev.video === enabled ? prev : { ...prev, video: enabled }));

            if (!streamRef.current) {
                if (enabled) {
                    updateConstraint("video", constraintOverride);
                }
                return;
            }

            if (enabled) {
                ensureTrack("video", constraintOverride);
            } else {
                disableTrack("video");
            }
        },
        [disableTrack, ensureTrack, updateConstraint]
    );

    return {
        startMediaStream,
        stopMediaStream,
        setAudioEnabled,
        setVideoEnabled,
        preferences,
        stream,
        waiting,
        error,
    };
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