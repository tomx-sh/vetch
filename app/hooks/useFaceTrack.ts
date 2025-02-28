"use client"
import {
    FaceDetector,
    FilesetResolver,
    Detection,
} from "@mediapipe/tasks-vision";
import { useCallback, useRef } from "react";


async function initializefaceDetector(runningMode: "IMAGE" | "VIDEO") {
    console.log("Initializing face detector...");
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );

    const faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
            delegate: "GPU"
        },
        runningMode: runningMode
    });

    console.log("Face detector initialized");
    return faceDetector;
};



export function useFaceTrack(): {
    startTracking: (args: {
        videoRef: React.RefObject<HTMLVideoElement>,
        timeInterval: number;
        onDetection?: (detection: Detection[]) => void;
    }) => Promise<void>;

    stopTracking: () => void;
} {
    const faceDetectorRef = useRef<FaceDetector | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startTracking = useCallback(async (args: {
        videoRef: React.RefObject<HTMLVideoElement>,
        timeInterval: number;
        onDetection?: (detection: Detection[]) => void;
    }) => {
        const { videoRef, timeInterval, onDetection } = args;
        console.log("Starting face tracking...");

        const faceDetector = await initializefaceDetector("VIDEO");
        faceDetectorRef.current = faceDetector;

        const detectFace = () => {
            const video = videoRef.current;
            if (!video) {
                console.log("No video");
                return;
            }
            if (video.paused || video.ended) {
                console.log("Video is paused or ended");
                return;
            }
            const detections = faceDetector.detectForVideo(video, performance.now()).detections;
            console.log("Face detected");
            onDetection?.(detections);
        }

        if (intervalRef.current) clearInterval(intervalRef.current);
        const newIntervalId = setInterval(detectFace, timeInterval);
        intervalRef.current = newIntervalId;

    }, [intervalRef, faceDetectorRef]);


    const stopTracking = useCallback(() => {
        console.log("Stopping face tracking...");

        faceDetectorRef.current?.close();
        faceDetectorRef.current = null;

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;

    }, [faceDetectorRef, intervalRef]);

    return { startTracking, stopTracking }
}


