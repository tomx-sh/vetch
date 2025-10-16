import { StartVideoBtn } from "@/components/features/start-video-btn";
import { MediaDevicesProvider } from "@/components/hooks/use-media-devices";
import { VideoBubble } from "@/components/features/video-bubble";
import { Canvas, CanvasApiProvider } from "@/components/features/canvas";
import { BlinkOnChange } from "@/components/features/blink-on-change";

export default function Home() {
    return (
        <MediaDevicesProvider>
            <CanvasApiProvider>
                <main className="relative w-dvw h-dvh overflow-hidden">
                    <Canvas
                        topRight={<BlinkOnChange />}
                        footer={<StartVideoBtn />}
                        className="w-full h-full"
                    />
                    <VideoBubble size={100} className="z-10 absolute bottom-2 right-2" />
                </main>
            </CanvasApiProvider>
        </MediaDevicesProvider>
    );
}
