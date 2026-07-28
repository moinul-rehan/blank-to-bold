"use client";

import { RoomObject } from "@/features/studio/room-object";

/** → Personal Journal. Thoughts, lessons, failures, growth. */
export function Notebook({
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
    <RoomObject id="notebook" x={x} y={y} width={width} depth={0.9} label="Notebook — the personal journal" onActivate={onActivate}>
      <svg viewBox="0 0 80 100" style={{ filter: "drop-shadow(0 8px 12px rgb(0 0 0 / 0.25))" }}>
        <rect x="2" y="2" width="76" height="96" rx="3" fill="var(--secondary)" stroke="var(--border)" />
        <rect x="2" y="2" width="10" height="96" fill="var(--foreground)" opacity="0.7" />
        <rect x="26" y="22" width="40" height="4" fill="var(--muted-foreground)" opacity="0.6" />
        <rect x="26" y="34" width="40" height="4" fill="var(--muted-foreground)" opacity="0.4" />
        <rect x="26" y="46" width="26" height="4" fill="var(--muted-foreground)" opacity="0.4" />
      </svg>
    </RoomObject>
  );
}
