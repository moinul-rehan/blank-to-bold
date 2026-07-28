"use client";

import { useState } from "react";
import { RoomObject } from "@/features/studio/room-object";

/** → Projects. Sleeps until hovered, wakes, click enters the gallery. */
export function Monitor({
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
  const [awake, setAwake] = useState(false);

  return (
    <div onMouseEnter={() => setAwake(true)} onMouseLeave={() => setAwake(false)} className="contents">
      <RoomObject id="monitor" x={x} y={y} width={width} depth={1} label="Monitor — view selected work" cursor="magnetic" onActivate={onActivate}>
        <svg viewBox="0 0 200 150" style={{ filter: "drop-shadow(0 18px 22px rgb(0 0 0 / 0.3))" }}>
          <rect x="10" y="8" width="180" height="112" rx="6" fill="var(--foreground)" opacity="0.9" />
          <rect
            x="18"
            y="16"
            width="164"
            height="96"
            rx="2"
            fill={awake ? "var(--primary)" : "var(--background)"}
            opacity={awake ? 0.9 : 0.95}
            style={{ transition: "fill 0.4s ease" }}
          />
          {awake && (
            <g opacity="0.85">
              <rect x="30" y="30" width="60" height="6" rx="2" fill="var(--background)" />
              <rect x="30" y="44" width="100" height="6" rx="2" fill="var(--background)" opacity="0.6" />
              <rect x="30" y="58" width="80" height="6" rx="2" fill="var(--background)" opacity="0.6" />
            </g>
          )}
          <rect x="90" y="120" width="20" height="14" fill="var(--muted-foreground)" />
          <rect x="60" y="134" width="80" height="8" rx="3" fill="var(--muted-foreground)" />
        </svg>
      </RoomObject>
    </div>
  );
}
