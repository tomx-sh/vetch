"use client"
import { useRef, useEffect, useState } from "react";
import { useFaceTrack } from "../hooks/useFaceTrack";
import { Detection } from "@mediapipe/tasks-vision";
import useFaceCentering from "../hooks/useFaceCentering";
import { cn } from "@/lib/utils";




export default function VideoBubble(props: {
    stream?: MediaStream | null;
    loading?: boolean;
    className?: string;
}) {
    const { stream, loading, className } = props;
    const videoRef = useRef<HTMLVideoElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const { startTracking, stopTracking } = useFaceTrack();
    const [faceDetection, setFaceDetection] = useState<Detection>();
    const { cssTransform, cssScale } = useFaceCentering({
        face: {
            originX: faceDetection?.boundingBox?.originX ?? 50,
            originY: faceDetection?.boundingBox?.originY ?? 50,
            width: faceDetection?.boundingBox?.width ?? 50,
            height: faceDetection?.boundingBox?.height ?? 50,
        },
        video: {
            width: videoRef.current?.videoWidth ?? 1920,
            height: videoRef.current?.videoHeight ?? 1080,
        },
        container: {
            width: boxRef.current?.clientWidth ?? 200,
            height: boxRef.current?.clientHeight ?? 200,
        },
        factor: 0.8,
    });


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


    return (
        <div
            ref={boxRef}
            className={cn("bg-muted rounded-full overflow-hidden shadow flex justify-center items-center", className)}
        >
            {
                loading ? <p>...</p> :
                    <video
                        autoPlay
                        playsInline
                        controls={false}
                        ref={videoRef}
                        style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            transform: cssTransform,
                            scale: cssScale,
                            transition: "transform 3s, scale 3s",
                        }}
                    />
            }
        </div>

    );
}