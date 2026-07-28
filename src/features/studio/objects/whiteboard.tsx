"use client";

import { RoomObject } from "@/features/studio/room-object";

/** → Systems Thinking. Architecture, flows, wireframes, planning. */
export function Whiteboard({
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
    <RoomObject id="whiteboard" x={x} y={y} width={width} depth={0.4} label="Whiteboard — systems thinking" onActivate={onActivate}>
      <svg viewBox="0 0 160 100">
        <rect x="0" y="0" width="160" height="100" rx="2" fill="var(--background)" stroke="var(--border)" />
        <rect x="14" y="16" width="26" height="16" fill="none" stroke="var(--muted-foreground)" opacity="0.6" />
        <rect x="70" y="16" width="26" height="16" fill="none" stroke="var(--muted-foreground)" opacity="0.6" />
        <rect x="120" y="16" width="26" height="16" fill="none" stroke="var(--primary)" opacity="0.7" />
        <path d="M40 24 H70 M96 24 H120" stroke="var(--muted-foreground)" opacity="0.6" />
        <path d="M27 32 V60 H83 M133 32 V60 H83" stroke="var(--muted-foreground)" opacity="0.4" fill="none" />
        <rect x="60" y="60" width="46" height="16" fill="none" stroke="var(--muted-foreground)" opacity="0.6" />
      </svg>
    </RoomObject>
  );
}
