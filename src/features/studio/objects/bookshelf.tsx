"use client";

import { RoomObject } from "@/features/studio/room-object";

/** → Learning Journey. Books become timeline entries. */
export function Bookshelf({
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
  const heights = [58, 70, 46, 64, 52, 68];
  return (
    <RoomObject id="bookshelf" x={x} y={y} width={width} depth={0.55} label="Bookshelf — the learning journey" onActivate={onActivate}>
      <svg viewBox="0 0 140 90" style={{ filter: "drop-shadow(0 10px 14px rgb(0 0 0 / 0.25))" }}>
        <rect x="0" y="80" width="140" height="6" fill="var(--muted-foreground)" opacity="0.6" />
        {heights.map((h, i) => (
          <rect
            key={i}
            x={6 + i * 22}
            y={80 - h}
            width="16"
            height={h}
            fill={i === 2 ? "var(--primary)" : "var(--foreground)"}
            opacity={i === 2 ? 0.8 : 0.55 + (i % 2) * 0.1}
          />
        ))}
      </svg>
    </RoomObject>
  );
}
