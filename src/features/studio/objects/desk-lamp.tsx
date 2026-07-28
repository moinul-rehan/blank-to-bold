"use client";

import { RoomObject } from "@/features/studio/room-object";

/** → Theme Switch. The one object that changes the whole room, not just itself. */
export function DeskLamp({
  x,
  y,
  width,
  lit,
  onActivate,
}: {
  x: number;
  y: number;
  width: number;
  lit: boolean;
  onActivate: () => void;
}) {
  return (
    <RoomObject id="lamp" x={x} y={y} width={width} depth={0.9} label="Desk lamp — toggle the room's lighting" onActivate={onActivate}>
      <svg viewBox="0 0 100 140" style={{ filter: "drop-shadow(0 12px 16px rgb(0 0 0 / 0.25))" }}>
        <rect x="35" y="120" width="30" height="8" rx="2" fill="var(--foreground)" opacity="0.85" />
        <rect x="47" y="60" width="6" height="62" fill="var(--muted-foreground)" />
        <path d="M50 60 L15 25 M15 25 L15 10" stroke="var(--muted-foreground)" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M0 10 L30 10 L22 40 L8 40 Z" fill={lit ? "var(--primary)" : "var(--muted-foreground)"} />
        {lit && (
          <ellipse cx="15" cy="55" rx="34" ry="20" fill="var(--primary)" opacity="0.16" />
        )}
      </svg>
    </RoomObject>
  );
}
