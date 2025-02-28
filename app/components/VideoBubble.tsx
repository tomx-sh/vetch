"use client"
import { useRef, useEffect } from "react";
import { Box, Spinner } from "@radix-ui/themes";
import { useFaceTrack } from "../hooks/useFaceTrack";




export default function VideoBubble(props: {
    stream?: MediaStream | null;
    loading?: boolean;
}) {
    const { stream, loading } = props;
    const videoRef = useRef<HTMLVideoElement>(null);

    
    const { startTracking, stopTracking } = useFaceTrack();

    useEffect(() => {
        const videoElement = videoRef.current;
        let onLoadedMetadata: () => void;


        if (videoElement !== null && stream !== undefined) {
            videoElement.srcObject = stream;

            onLoadedMetadata = () => {
                startTracking({
                    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
                    timeInterval: 1000
                });
            }

            videoElement.addEventListener("loadedmetadata", onLoadedMetadata);
        }

        return () => {
            videoElement?.removeEventListener("loadedmetadata", onLoadedMetadata);
            stopTracking();
        }
    }, [stream, startTracking, stopTracking]);

    return (
        <Box style={{
            backgroundColor: "var(--gray-4)",
            height: "100px",
            width: "100px",
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "var(--shadow-4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            {
                loading ? <Spinner size="3" /> :
                    <video
                        autoPlay
                        playsInline
                        controls={false}
                        ref={videoRef}
                        style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                        }}
                    />
            }
        </Box>

    );
}