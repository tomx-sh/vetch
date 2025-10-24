import { Result, ok, err } from "neverthrow";

type Args = {
    video: boolean;
    audio: boolean;
    askForMediaDevices: (video: boolean, audio: boolean) => Promise<Result<MediaStream, Error>>;
    setMediaStream: (stream: MediaStream | null) => void;
    generateRoomCode: () => string;
    redirectToRoom: (code: string) => void;
}


export async function startSession(args: Args): Promise<Result<void, Error>> {
    const { video, audio, askForMediaDevices, setMediaStream, generateRoomCode, redirectToRoom } = args;
    console.log("Starting session with video:", video, "audio:", audio);

    const streamResult = await askForMediaDevices(video, audio);
    if (streamResult.isOk()) {
        const stream = streamResult.value;
        console.log("Media stream obtained:", stream);
        setMediaStream(stream);
    } else {
        console.warn("No media stream obtained.");
        setMediaStream(null);
        return err(streamResult.error);
    }

    const roomCode = generateRoomCode();
    console.log("Generated room code:", roomCode);
    redirectToRoom(roomCode);
    return ok();
}