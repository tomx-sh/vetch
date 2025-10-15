import { StartVideoBtn } from "@/components/features/start-video-btn";
import { MediaDevicesProvider } from "@/components/hooks/use-media-devices";
import { VideoBubble } from "@/components/features/video-bubble";
import { CornersDraggable } from "@/components/views/corners-draggable";
import { Canvas } from "@/components/features/canvas";

export default function Home() {
    return (
        <MediaDevicesProvider>
            <main className="relative w-dvw h-dvh overflow-hidden">
                <Canvas
                    footer={<StartVideoBtn />}
                    className="w-full h-full"
                />


                {/* <CornersDraggable className="absolute inset-0">
                    <VideoBubble size={100} />
                </CornersDraggable> */}
            </main>
        </MediaDevicesProvider>
    );
}
