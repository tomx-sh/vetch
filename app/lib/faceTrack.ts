type Rectangle = {
    originX: number;
    originY: number;
    width: number;
    height: number;
}


function getRectangleCenter(rect: Rectangle) {
    const { originX, originY, width, height } = rect;
    return {
        x: originX + width / 2,
        y: originY + height / 2,
    }
}

/**
 * Get the transform values to center a rectangle in a container
 */
function getCenteringTransform(args: {
    rect: Rectangle;
    containerWidth: number;
    containerHeight: number;
}): {
    transformX: number;
    transformY: number;
} {
    const { rect, containerWidth, containerHeight } = args;
    const { x, y } = getRectangleCenter(rect);

    return {
        transformX: containerWidth / 2 - x,
        transformY: containerHeight / 2 - y,
    }
}

/**
 * Calculate how much a rectangle has been scaled
 * (works even if the rectangle has been scaled non-uniformly)
 */
function getScale(args: {
    originalWidth: number;
    originalHeight: number;
    finalWidth: number;
    finalHeight: number;
}): number {
    const { originalWidth, originalHeight, finalWidth, finalHeight } = args;
    return Math.min(finalWidth / originalWidth, finalHeight / originalHeight);
}


/**
 * Given a face coordinates inside a video rectangle,
 * calculate the transform values to center the face in a container.
 * The video must be centered in the container (object-fit: cover).
 * videoWidth and videoHeight are the original dimensions of the video.
 * containerWidth and containerHeight are the actual dimensions of the container.
 */
export function getFaceCenteringTransform(args: {
    face: Rectangle;
    videoWidth: number;
    videoHeight: number;
    containerWidth: number;
    containerHeight: number;
}): {
    transformX: number;
    transformY: number;
} {
    const { face, videoWidth, videoHeight, containerWidth, containerHeight } = args;
    const { transformX, transformY } = getCenteringTransform({
        rect: face,
        containerWidth: videoWidth,
        containerHeight: videoHeight,
    });

    const scale = getScale({
        originalWidth: videoWidth,
        originalHeight: videoHeight,
        finalWidth: containerWidth,
        finalHeight: containerHeight,
    });

    return {
        transformX: transformX * scale,
        transformY: transformY * scale,
    }
}


/**
 * Calculate a scaling factor in order to make
 * the face rectangle big enough to fill a container.
 */
export function getFaceScaling(args: {
    factor: number;
    face: Rectangle;
    containerWidth: number;
    containerHeight: number;
}): number {
    const { factor, face, containerWidth, containerHeight } = args;
    const scale = getScale({
        originalWidth: face.width,
        originalHeight: face.height,
        finalWidth: containerWidth * factor,
        finalHeight: containerHeight * factor,
    });

    return scale;
}