import { StartVideoBtn } from "@/components/features/start-video-btn";
import { MediaDevicesProvider } from "@/components/hooks/use-media-devices";
import { VideoBubble } from "@/components/features/video-bubble";
import { Canvas, CanvasApiProvider } from "@/components/features/canvas";
import { BlinkOnChange } from "@/components/features/blink-on-change";
import Link from "next/link";
import { RealtimeCursors } from "@/components/features/realtime-cursors";



export default async function RoomPage(props: PageProps<'/[room]'>) {
    const { room } = await props.params;
    return (
        <MediaDevicesProvider>
            <CanvasApiProvider>
                <main className="relative w-dvw h-dvh overflow-hidden">
                    <Canvas
                        topRight={<BlinkOnChange />}
                        //topRight={<p>{room}</p>}
                        footer={<StartVideoBtn />}
                        className="w-full h-full"
                    />
                    <VideoBubble size={100} className="z-10 absolute bottom-2 right-2" />
                    <Link href="/hello" className="z-10 absolute top-2 left-2">
                        Room Settings
                    </Link>

                    <RealtimeCursors roomName={"room:001"} username="Anonymous" />
                </main>
            </CanvasApiProvider>
        </MediaDevicesProvider>
    );
}
