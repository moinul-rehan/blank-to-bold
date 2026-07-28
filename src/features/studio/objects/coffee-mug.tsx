"use client";

import { RoomObject } from "@/features/studio/room-object";

/** → Random Facts. Personal details, hobbies, small moments. */
export function CoffeeMug({
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
    <RoomObject id="mug" x={x} y={y} width={width} depth={0.85} label="Coffee mug — random facts" onActivate={onActivate}>
      <svg viewBox="0 0 60 60" style={{ filter: "drop-shadow(0 6px 8px rgb(0 0 0 / 0.25))" }}>
        <path d="M40 46 Q52 46 52 36 Q52 28 40 28" stroke="var(--muted-foreground)" strokeWidth="4" fill="none" />
        <rect x="10" y="24" width="32" height="24" rx="3" fill="var(--primary)" opacity="0.85" />
        <path d="M16 12 Q20 6 16 0 M26 12 Q30 6 26 0" stroke="var(--muted-foreground)" strokeWidth="2" fill="none" opacity="0.5" />
      </svg>
    </RoomObject>
  );
}
