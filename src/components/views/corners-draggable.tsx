"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    closestCorners,
    type DragEndEvent,
    type DragStartEvent,
    useDroppable,
    useDraggable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "../lib/utils";

type CornerPosition = "top-left" | "top-right" | "bottom-right" | "bottom-left";

type CornersDraggableProps = {
    children: ReactNode;
    className?: string;
    initialCorner?: CornerPosition;
    paddingClassName?: string;
    dragOverlay?: ReactNode;
};

const corners: CornerPosition[] = ["top-left", "top-right", "bottom-right", "bottom-left"];

const alignmentClass: Record<CornerPosition, string> = {
    "top-left": "items-start justify-start",
    "top-right": "items-start justify-end",
    "bottom-right": "items-end justify-end",
    "bottom-left": "items-end justify-start",
};

const cornerPlacementClass: Record<CornerPosition, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
};

function CornerDroppable({ corner }: { corner: CornerPosition }) {
    const { setNodeRef, isOver } = useDroppable({ id: corner });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "relative h-full w-full transition-colors",
                alignmentClass[corner],
                isOver && "bg-muted/10"
            )}
            style={{ pointerEvents: "none" }}
        />
    );
}

function CornerDraggable({ children }: { children: ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: "corners-draggable-item",
    });

    const style = transform
        ? {
            transform: CSS.Translate.toString(transform),
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "cursor-grab touch-none select-none",
                isDragging && "cursor-grabbing"
            )}
            style={{ ...style, opacity: isDragging ? 0 : undefined }}
            {...listeners}
            {...attributes}
        >
            {children}
        </div>
    );
}

export function CornersDraggable({
    children,
    className,
    initialCorner = "bottom-right",
    paddingClassName = "p-4",
    dragOverlay,
}: CornersDraggableProps) {
    const [isClient, setIsClient] = useState(false);
    const [activeCorner, setActiveCorner] = useState<CornerPosition>(initialCorner);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const sensors = useSensors(useSensor(PointerSensor));
    const overlayContent = dragOverlay ?? children;

    if (!isClient) {
        return (
            <div className={cn("relative h-full w-full", className)}>
                <div
                    className={cn(
                        "absolute",
                        cornerPlacementClass[initialCorner],
                        paddingClassName
                    )}
                >
                    {children}
                </div>
            </div>
        );
    }

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveId(String(active.id));
    };

    const handleDragEnd = ({ over }: DragEndEvent) => {
        if (over) {
            setActiveCorner(over.id as CornerPosition);
        }
        setActiveId(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className={cn("pointer-events-none", className)}>
                <div className="grid h-full w-full grid-cols-2 grid-rows-2">
                    {corners.map((corner) => (
                        <CornerDroppable key={corner} corner={corner} />
                    ))}
                </div>
            </div>

            <div
                className={cn(
                    "absolute z-10 pointer-events-auto",
                    cornerPlacementClass[activeCorner],
                    paddingClassName
                )}
            >
                <CornerDraggable>{children}</CornerDraggable>
            </div>

            <DragOverlay dropAnimation={{ duration: 180 }}>
                {activeId ? overlayContent : null}
            </DragOverlay>
        </DndContext>
    );
}
