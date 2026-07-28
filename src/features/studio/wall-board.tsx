"use client";

/**
 * A wooden-framed board with a scatter of sticky notes, composited onto the
 * wall near the "whiteboard" hotspot (Systems Thinking — architecture &
 * flows). Flat HTML/CSS rather than a 3D model: unlike the desk objects,
 * this sits flush against the wall facing the camera head-on, so it reads
 * fine without real depth — same reasoning as the lamp toggle staying a
 * plain DOM element instead of a model. Originally centered on the
 * "whiteboard" hotspot's own x/y (42, 20) so the dot would land on the
 * board; moved per feedback several times (left 42 → 48 → 80 → 60 → 70), which
 * the hotspot position in room-stage.tsx was NOT moved to match — the dot
 * no longer lands on the board at this position. Size/placement are a
 * first-pass estimate against the room photo's plain gray wall — not
 * visually confirmed on top of the actual composited scene
 * (no browser/screenshot tool available this session).
 */
const STICKY_NOTES: {
  top: string;
  left: string;
  rotate: number;
  color: string;
}[] = [
  { top: "16%", left: "12%", rotate: -6, color: "#fde68a" },
  { top: "20%", left: "44%", rotate: 4, color: "#fca5a5" },
  { top: "54%", left: "18%", rotate: 3, color: "#93c5fd" },
  { top: "50%", left: "58%", rotate: -4, color: "#86efac" },
];

export function WallBoard() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: "70%", top: "20%", width: "7.5%", aspectRatio: "4 / 3" }}
    >
      {/* Frame */}
      <div
        className="absolute inset-0 rounded-sm shadow-lg"
        style={{ background: "#8a5a34", padding: "4%" }}
      >
        {/* Board surface */}
        <div
          className="relative h-full w-full rounded-[2px]"
          style={{ background: "#e8e4da" }}
        >
          {STICKY_NOTES.map((note, i) => (
            <div
              key={i}
              className="absolute rounded-[1px] shadow-sm"
              style={{
                top: note.top,
                left: note.left,
                width: "22%",
                aspectRatio: "1 / 1",
                background: note.color,
                transform: `rotate(${note.rotate}deg)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
