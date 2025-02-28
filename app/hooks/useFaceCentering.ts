"use client"
import { getFaceCenteringTransform, getFaceScaling } from "../lib/faceTrack";

export default function useFaceCentering(args: {
    face: {
        originX: number;
        originY: number;
        width: number;
        height: number;
    },
    video: {
        width: number;
        height: number;
    },
    container: {
        width: number;
        height: number;
    },
    factor?: number;
}): {
    cssTransform: string;
    cssScale: number;
} {

    const { face, video, container, factor } = args;

    const transform = getFaceCenteringTransform({
        face: face,
        videoWidth: video.width,
        videoHeight: video.height,
        containerWidth: container.width,
        containerHeight: container.height,
    });

    const cssTransform = `translate(${transform.transformX}px, ${transform.transformY}px)`;

    const scale = getFaceScaling({
        factor: factor ?? 1,
        face: face,
        containerWidth: container.width,
        containerHeight: container.height,
    });

    const cssScale = scale

    return { cssTransform, cssScale };
}