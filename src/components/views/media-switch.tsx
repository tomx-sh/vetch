"use client"
import { Video, VideoOff, Mic, MicOff, LucideProps } from "lucide-react";
import { Switch } from "../ui/switch";
import { cloneElement } from "react";
import { Label } from "../ui/label";
import { cn } from "../lib/utils";

type SwitchIconProps = {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    onIcon: React.ReactElement<LucideProps>;
    offIcon: React.ReactElement<LucideProps>;
    className?: string;
}

function SwitchIcon({ enabled, onChange, onIcon, offIcon, className }: SwitchIconProps) {
    const iconSize = 16;
    const onIconWithSize = cloneElement(onIcon, { size: iconSize });
    const offIconWithSize = cloneElement(offIcon, { size: iconSize });

    return (
        <Label className={cn("flex gap-1.5 items-center cursor-pointer text-muted-foreground", className)}>
            {enabled ? onIconWithSize : offIconWithSize}
            <Switch checked={enabled} onCheckedChange={onChange} />
        </Label>
    );
}


type MediaSwitchProps = {
    type: 'audio' | 'video';
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    className?: string;
}

export function MediaSwitch({ type, enabled, onChange, className }: MediaSwitchProps) {

    if (type === 'video') {
        return (
            <SwitchIcon
                enabled={enabled}
                onChange={onChange}
                onIcon={<Video />}
                offIcon={<VideoOff />}
                className={className}
            />
        )
    } else {
        return (
            <SwitchIcon
                enabled={enabled}
                onChange={onChange}
                onIcon={<Mic />}
                offIcon={<MicOff />}
                className={className}
            />
        )
    }
}