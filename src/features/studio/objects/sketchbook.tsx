"use client";

import { RoomObject } from "@/features/studio/room-object";

/** → Design Process. Pages flip; sketches evolve into polished UI. */
export function Sketchbook({
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
    <RoomObject id="sketchbook" x={x} y={y} width={width} depth={0.95} label="Sketchbook — the design process" onActivate={onActivate}>
      <svg viewBox="0 0 110 80" style={{ filter: "drop-shadow(0 8px 12px rgb(0 0 0 / 0.25))" }}>
        <rect x="4" y="10" width="100" height="66" rx="3" fill="var(--card)" stroke="var(--border)" />
        <path d="M8 12 L100 12" stroke="var(--border)" />
        <path d="M54 14 Q60 45 50 74" stroke="var(--muted-foreground)" strokeWidth="2" fill="none" opacity="0.4" />
        <path d="M20 55 L35 30 L50 55" stroke="var(--foreground)" strokeWidth="2" fill="none" opacity="0.7" />
        <rect x="66" y="30" width="28" height="20" rx="2" stroke="var(--primary)" strokeWidth="2" fill="none" />
      </svg>
    </RoomObject>
  );
}
