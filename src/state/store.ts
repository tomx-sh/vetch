import { create } from 'zustand';

type LocalMediaStream = {
    status: 'off'
} | {
    status: 'waiting-for-permission'
    askingFor: { audio: boolean, video: boolean }
} | {
    status: 'loading'
    stream: MediaStream;
} | {
    status: 'on'
    stream: MediaStream;
} | {
    status: 'error'
    error: Error;
}


type Store = {
    sessionState: 'closed' | 'live';
    localMediaStream: LocalMediaStream;
    localMediaSettings: { audio: boolean; video: boolean };
}



const initialState: Store = {
    sessionState: 'closed',
    localMediaStream: { status: 'off' },
    localMediaSettings: { audio: true, video: true },
};

export const useStore = create<Store>(() => (initialState));