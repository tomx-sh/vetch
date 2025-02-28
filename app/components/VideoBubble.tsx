"use client"
import { useRef, useEffect, useState, useMemo } from "react";
import { Box, Spinner } from "@radix-ui/themes";
import { useFaceTrack } from "../hooks/useFaceTrack";
import { getFaceCenteringTransform } from "../lib/faceTrack";
import { Detection } from "@mediapipe/tasks-vision";




export default function VideoBubble(props: {
    stream?: MediaStream | null;
    loading?: boolean;
}) {
    const { stream, loading } = props;
    const videoRef = useRef<HTMLVideoElement>(null);
    const { startTracking, stopTracking } = useFaceTrack();
    const [faceDetection, setFaceDetection] = useState<Detection>();


    useEffect(() => {
        const videoElement = videoRef.current;
        let onLoadedMetadata: () => void;


        if (videoElement !== null && stream !== undefined) {
            videoElement.srcObject = stream;

            onLoadedMetadata = () => {
                startTracking({
                    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
                    timeInterval: 3000,
                    onDetection: detections => {
                        console.log("Detections", detections);
                        setFaceDetection(detections[0]);
                    }
                });
            }

            videoElement.addEventListener("loadedmetadata", onLoadedMetadata);
        }

        return () => {
            videoElement?.removeEventListener("loadedmetadata", onLoadedMetadata);
            stopTracking();
        }
    }, [stream, startTracking, stopTracking]);



    const faceTransform = useMemo(() => {
        if (!faceDetection?.boundingBox) {
            return;
        }

        const {
            originX,
            originY,
            width,
            height,
        } = faceDetection.boundingBox;

        const transform = getFaceCenteringTransform({
            face: {
                originX,
                originY,
                width,
                height,
            },
            videoWidth: videoRef.current?.videoWidth ?? 0,
            videoHeight: videoRef.current?.videoHeight ?? 0,
            containerWidth: 200,
            containerHeight: 200,
        });

        const cssTransform = `translate(${transform.transformX}px, ${transform.transformY}px)`;
        return cssTransform;

    }, [faceDetection]);

    return (
        <Box style={{
            backgroundColor: "var(--gray-4)",
            height: "200px",
            width: "200px",
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
                            transform: faceTransform ?? "none",
                            transition: "transform 3s",
                        }}
                    />
            }
        </Box>

    );
}