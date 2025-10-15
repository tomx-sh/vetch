import { StartVideoBtn } from "@/components/features/start-video-btn";
import { MediaDevicesProvider } from "@/components/hooks/use-media-devices";
import { VideoBubble } from "@/components/features/video-bubble";
import { CornersDraggable } from "@/components/views/corners-draggable";

export default function Home() {
    return (
        <MediaDevicesProvider>
            <main className="relative w-dvw h-dvh overflow-hidden">

                <StartVideoBtn className="absolute bottom-0 left-1/2 translate-x-[-50%] mb-4" />
                <CornersDraggable className="absolute inset-0">
                    <VideoBubble size={100} />
                </CornersDraggable>
            </main>
        </MediaDevicesProvider>
    );
}
