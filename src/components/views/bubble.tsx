import { cn } from "../lib/utils";


export type BubbleProps = {
    size: number;
    children: React.ReactNode;
    badge?: React.ReactNode;
    className?: string;
}

export function Bubble({ size, children, badge, className }: BubbleProps) {
    const { left, top, badgeSize } = computeBadgePosition(size, (225 * Math.PI) / 180);

    return (
        <div className={cn("relative", className)}>
            <div
                className="inline-flex items-center justify-center rounded-full shadow-xl bg-muted overflow-hidden"
                style={{ width: size, height: size }}
            >
                {children}
            </div>
            {badge && (
                <div
                    className="absolute bg-background rounded-full border overflow-hidden flex items-center justify-center"
                    style={{ width: badgeSize, height: badgeSize, left, top }}
                >
                    {badge}
                </div>
            )}
        </div>
    );
}

// Helper: compute badge left/top coordinates so the badge center lies on the circle edge
// size: diameter of the circle in pixels
// angle: angle in radians where 0 is to the right (east) and positive is counter-clockwise
// returns { left, top, badgeSize }
export function computeBadgePosition(size: number, angle: number) {
    const badgeSize = size / 3.5;
    const r = size / 2;
    const cx = size / 2;
    const cy = size / 2;
    // screen Y axis grows downward, so invert the sine term to map math coords to screen coords
    const centerX = cx + r * Math.cos(angle);
    const centerY = cy - r * Math.sin(angle);
    const left = centerX - badgeSize / 2;
    const top = centerY - badgeSize / 2;

    return { left, top, badgeSize };
}
