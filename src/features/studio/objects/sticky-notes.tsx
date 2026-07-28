"use client";

import { RoomObject } from "@/features/studio/room-object";

/** → Quick Experiments. Small interactive prototypes and fun ideas. */
export function StickyNotes({
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
    <RoomObject id="sticky-notes" x={x} y={y} width={width} depth={0.6} label="Sticky notes — quick experiments" onActivate={onActivate}>
      <svg viewBox="0 0 90 70" style={{ filter: "drop-shadow(0 6px 10px rgb(0 0 0 / 0.2))" }}>
        <rect x="4" y="18" width="34" height="34" fill="var(--primary)" opacity="0.75" transform="rotate(-6 21 35)" />
        <rect x="34" y="8" width="34" height="34" fill="var(--secondary)" transform="rotate(4 51 25)" />
        <rect x="52" y="24" width="34" height="34" fill="var(--muted)" transform="rotate(-3 69 41)" />
      </svg>
    </RoomObject>
  );
}
