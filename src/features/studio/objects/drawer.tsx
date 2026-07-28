"use client";

import { RoomObject } from "@/features/studio/room-object";

/** → Hidden Playground. Unexpected interactions, unreleased concept work. */
export function Drawer({
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
    <RoomObject id="drawer" x={x} y={y} width={width} depth={0.7} label="Drawer — a hidden playground" onActivate={onActivate}>
      <svg viewBox="0 0 100 40" style={{ filter: "drop-shadow(0 6px 10px rgb(0 0 0 / 0.25))" }}>
        <rect x="0" y="0" width="100" height="40" rx="2" fill="var(--card)" stroke="var(--border)" />
        <rect x="42" y="16" width="16" height="5" rx="2" fill="var(--muted-foreground)" />
      </svg>
    </RoomObject>
  );
}
