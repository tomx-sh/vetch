"use client"
import { createClient } from "@/infra/supabase/client"
import { useMemo, useEffect, useState } from "react";
import { RealtimePresence, RealtimePresenceState } from "@supabase/supabase-js";

type Args = {
    roomId: string;
};

type Presences = {
    presences: RealtimePresenceState;
}

export function usePresence({ roomId }: Args): Presences {
    const [presences, setPresences] = useState<RealtimePresenceState>({});


    useEffect(() => {
        const supabase = createClient();
        const room = supabase.channel(roomId);
        room
            .on('presence', { event: 'sync' }, () => {
                const newState = room.presenceState();
                console.log('sync', newState);
                setPresences(newState);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('join', key, newPresences);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('leave', key, leftPresences);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    room.track({ online_at: new Date().toISOString() });
                }
            });

        return () => {
            //supabase.removeChannel(room);
            //supabase.
            room.unsubscribe();
        };
    }, [roomId]);

    return { presences };
}