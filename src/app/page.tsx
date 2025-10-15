import { StartVideoBtn } from "@/components/features/start-video-btn";
import { MediaDevicesProvider } from "@/components/hooks/use-media-devices";
import { VideoBubble } from "@/components/features/video-bubble";
import { Canvas } from "@/components/features/canvas";

export default function Home() {
    return (
        <MediaDevicesProvider>
            <main className="relative w-dvw h-dvh overflow-hidden">
                <Canvas
                    footer={<StartVideoBtn />}
                    className="w-full h-full"
                />


                <VideoBubble size={100} className="z-10 absolute bottom-0 right-0" />
            </main>
        </MediaDevicesProvider>
    );
}
