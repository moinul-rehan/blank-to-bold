"use client";

import { RoomObject } from "@/features/studio/room-object";

/**
 * Ambient objects — no `→ destination` was specified for these in the brief,
 * so they stay atmospheric: individually interactive (tilt/glow, same as
 * every other object) but with no panel to open. Populates the room without
 * inventing navigation the brief didn't ask for.
 */

export function Plant({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <RoomObject id="plant" x={x} y={y} width={width} depth={0.5} label="Plant" cursor="hover">
      <svg viewBox="0 0 60 80" style={{ filter: "drop-shadow(0 8px 10px rgb(0 0 0 / 0.2))" }}>
        <path d="M30 80 L30 40" stroke="var(--foreground)" strokeWidth="2" opacity="0.5" />
        <path d="M30 50 Q10 40 8 15 Q28 25 30 50" fill="var(--primary)" opacity="0.6" />
        <path d="M30 45 Q50 32 52 8 Q32 20 30 45" fill="var(--primary)" opacity="0.45" />
        <path d="M30 55 Q45 50 48 30 Q30 35 30 55" fill="var(--primary)" opacity="0.55" />
        <path d="M14 80 L46 80 L42 56 L18 56 Z" fill="var(--card)" stroke="var(--border)" />
      </svg>
    </RoomObject>
  );
}

export function Headphones({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <RoomObject id="headphones" x={x} y={y} width={width} depth={0.65} label="Headphones" cursor="hover">
      <svg viewBox="0 0 60 50" style={{ filter: "drop-shadow(0 6px 8px rgb(0 0 0 / 0.2))" }}>
        <path d="M6 30 Q6 4 30 4 Q54 4 54 30" stroke="var(--foreground)" strokeWidth="3" fill="none" opacity="0.7" />
        <rect x="2" y="26" width="12" height="18" rx="4" fill="var(--foreground)" opacity="0.7" />
        <rect x="46" y="26" width="12" height="18" rx="4" fill="var(--foreground)" opacity="0.7" />
      </svg>
    </RoomObject>
  );
}

export function Camera({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <RoomObject id="camera" x={x} y={y} width={width} depth={0.6} label="Camera" cursor="hover">
      <svg viewBox="0 0 70 46" style={{ filter: "drop-shadow(0 6px 8px rgb(0 0 0 / 0.2))" }}>
        <rect x="2" y="10" width="66" height="32" rx="4" fill="var(--foreground)" opacity="0.85" />
        <rect x="20" y="2" width="18" height="10" rx="2" fill="var(--foreground)" opacity="0.85" />
        <circle cx="35" cy="26" r="12" fill="var(--muted)" />
        <circle cx="35" cy="26" r="7" fill="var(--background)" opacity="0.6" />
      </svg>
    </RoomObject>
  );
}

export function PenHolder({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <RoomObject id="pen-holder" x={x} y={y} width={width} depth={0.85} label="Pen holder" cursor="hover">
      <svg viewBox="0 0 40 50" style={{ filter: "drop-shadow(0 6px 8px rgb(0 0 0 / 0.2))" }}>
        <rect x="4" y="18" width="32" height="30" rx="3" fill="var(--muted)" stroke="var(--border)" />
        <line x1="12" y1="20" x2="8" y2="0" stroke="var(--foreground)" strokeWidth="3" opacity="0.7" />
        <line x1="20" y1="20" x2="22" y2="2" stroke="var(--primary)" strokeWidth="3" opacity="0.8" />
        <line x1="28" y1="20" x2="30" y2="6" stroke="var(--muted-foreground)" strokeWidth="3" opacity="0.7" />
      </svg>
    </RoomObject>
  );
}

export function Laptop({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <RoomObject id="laptop" x={x} y={y} width={width} depth={0.8} label="Laptop" cursor="hover">
      <svg viewBox="0 0 100 60" style={{ filter: "drop-shadow(0 8px 10px rgb(0 0 0 / 0.22))" }}>
        <path d="M20 8 H80 L86 42 H14 Z" fill="var(--foreground)" opacity="0.85" />
        <path d="M23 11 H77 L82 39 H18 Z" fill="var(--background)" opacity="0.9" />
        <path d="M4 42 H96 L90 50 H10 Z" fill="var(--muted-foreground)" opacity="0.7" />
      </svg>
    </RoomObject>
  );
}

export function Keyboard({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <RoomObject id="keyboard" x={x} y={y} width={width} depth={0.95} label="Keyboard" cursor="hover">
      <svg viewBox="0 0 120 36" style={{ filter: "drop-shadow(0 6px 8px rgb(0 0 0 / 0.2))" }}>
        <rect x="0" y="0" width="120" height="36" rx="4" fill="var(--foreground)" opacity="0.85" />
        {Array.from({ length: 8 }, (_, col) =>
          Array.from({ length: 3 }, (_, row) => (
            <rect
              key={`${col}-${row}`}
              x={6 + col * 14}
              y={6 + row * 10}
              width="10"
              height="7"
              rx="1.5"
              fill="var(--background)"
              opacity="0.5"
            />
          )),
        )}
      </svg>
    </RoomObject>
  );
}

export function Mouse({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <RoomObject id="mouse" x={x} y={y} width={width} depth={0.95} label="Mouse" cursor="hover">
      <svg viewBox="0 0 26 40" style={{ filter: "drop-shadow(0 6px 8px rgb(0 0 0 / 0.2))" }}>
        <rect x="2" y="2" width="22" height="36" rx="11" fill="var(--foreground)" opacity="0.85" />
        <line x1="13" y1="2" x2="13" y2="16" stroke="var(--background)" opacity="0.4" />
      </svg>
    </RoomObject>
  );
}
