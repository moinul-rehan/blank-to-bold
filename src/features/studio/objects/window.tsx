"use client";

import { RoomObject } from "@/features/studio/room-object";

/** → Future Vision. What's outside is what's next. */
export function Window({
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
    <RoomObject id="window" x={x} y={y} width={width} depth={0.3} label="Window — the vision ahead" onActivate={onActivate}>
      <svg viewBox="0 0 160 130">
        <rect x="0" y="0" width="160" height="130" fill="var(--foreground)" opacity="0.9" />
        <rect x="8" y="8" width="144" height="114" fill="var(--primary)" opacity="0.14" />
        <rect x="8" y="8" width="144" height="114" fill="none" stroke="var(--foreground)" opacity="0.4" />
        <line x1="80" y1="8" x2="80" y2="122" stroke="var(--foreground)" opacity="0.4" />
        <line x1="8" y1="65" x2="152" y2="65" stroke="var(--foreground)" opacity="0.4" />
      </svg>
    </RoomObject>
  );
}
