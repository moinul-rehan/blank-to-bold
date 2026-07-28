"use client";

import { RoomObject } from "@/features/studio/room-object";

/** → About Me. A slow zoom into the photo is the transition itself. */
export function PhotoFrame({
  x,
  y,
  width,
  onActivate,
}: {
  x: number;
  y: number;
  width: number;
  onActivate: () => void;
}) {
  return (
    <RoomObject id="photo-frame" x={x} y={y} width={width} depth={0.75} label="Photo frame — about Rehan" cursor="magnetic" onActivate={onActivate}>
      <svg viewBox="0 0 90 110" style={{ filter: "drop-shadow(0 10px 14px rgb(0 0 0 / 0.25))" }}>
        <rect x="2" y="2" width="86" height="106" rx="3" fill="var(--foreground)" opacity="0.85" />
        <rect x="9" y="9" width="72" height="92" fill="var(--muted)" />
        <circle cx="45" cy="42" r="15" fill="var(--muted-foreground)" opacity="0.5" />
        <path d="M20 88 Q45 55 70 88 Z" fill="var(--muted-foreground)" opacity="0.5" />
        <rect x="36" y="102" width="18" height="6" fill="var(--muted-foreground)" opacity="0.6" />
      </svg>
    </RoomObject>
  );
}
