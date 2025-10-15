"use client"
import { Video, VideoOff, Mic, MicOff, LucideProps } from "lucide-react";
import { Switch } from "../ui/switch";
import { cloneElement } from "react";
import { Label } from "../ui/label";
import { cn } from "../lib/utils";

type MediaControlViewProps = {
    audioEnabled: boolean;
    videoEnabled: boolean;
    onAudioToggle: (enabled: boolean) => void;
    onVideoToggle: (enabled: boolean) => void;
    className?: string;
}


export function MediaControlView({ audioEnabled, videoEnabled, onAudioToggle, onVideoToggle, className }: MediaControlViewProps) {
    return (
        <div className={cn("flex gap-4", className)}>
            <SwitchIcon
                enabled={videoEnabled}
                onChange={onVideoToggle}
                onIcon={<Video />}
                offIcon={<VideoOff />}
            />
            <SwitchIcon
                enabled={audioEnabled}
                onChange={onAudioToggle}
                onIcon={<Mic />}
                offIcon={<MicOff />}
            />
        </div>
    )
}



type SwitchIconProps = {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    onIcon: React.ReactElement<LucideProps>;
    offIcon: React.ReactElement<LucideProps>;
}

function SwitchIcon({ enabled, onChange, onIcon, offIcon }: SwitchIconProps) {
    const iconSize = 16;
    const onIconWithSize = cloneElement(onIcon, { size: iconSize });
    const offIconWithSize = cloneElement(offIcon, { size: iconSize });

    return (
        <Label className="flex gap-1.5 items-center cursor-pointer text-muted-foreground">
            {enabled ? onIconWithSize : offIconWithSize}
            <Switch checked={enabled} onCheckedChange={onChange} />
        </Label>
    );
}