"use client";

import { forwardRef } from "react";
import { Caveat } from "next/font/google";

/**
 * Marker-style handwriting font for the sticky notes — self-hosted by
 * Next.js at build time (no runtime request to Google Fonts), scoped to
 * this component only rather than added to the global font stack in
 * layout.tsx, since nothing else in the app currently needs a handwritten
 * look.
 */
const handwriting = Caveat({ subsets: ["latin"], weight: ["600", "700"] });

/**
 * A wooden-framed board with sticky notes, composited onto the wall (the
 * "whiteboard" id — Systems Thinking, architecture & flows). Flat HTML/CSS
 * rather than a 3D model: unlike the desk objects, this sits flush against
 * the wall facing the camera head-on, so it reads fine without real depth
 * — same reasoning as the lamp toggle staying a plain DOM element instead
 * of a model. Is itself the click target (see the exported component) —
 * no separate Hotspot, since it's a real asset now, not an invisible
 * point. Clicking it focuses the camera on it directly (centered, per
 * `use-room-camera.ts`) rather than opening a separate panel overlay — the
 * enlarged, centered board already shows every note, so a modal on top
 * would just cover it back up (see room-stage.tsx's `FOCUS_ONLY_IDS`).
 * Position moved several times per feedback (left 42 → 48 → 80 → 60 → 66,
 * top 20 → 35); this final position (66, 35) must stay in sync with
 * `BOARD_X`/`BOARD_Y` in room-stage.tsx if it moves again — both the focus
 * target and the standalone focus-zoom math there depend on it.
 *
 * Rendered as a sibling of the blurred/dimmed room stage in
 * room-stage.tsx, not nested inside it — a real screenshot showed the
 * board visibly softened by the stage's focus filter (a 1.5px blur reads
 * as much more once magnified by the zoom scale) plus too small to read
 * comfortably at the stage's generic 2.3x zoom. room-stage.tsx drives this
 * board's own independent, larger zoom+recenter via a ref, in parallel
 * with the backdrop's blur/dim — so it stays sharp while the room around
 * it softens. No `-translate-x/y-1/2` utility class here (unlike other
 * self-centering room elements) — GSAP owns the full transform
 * (`xPercent`/`yPercent` baseline plus the animated `x`/`y`/`scale`) once
 * it's driving this element, and mixing a class-based transform with
 * GSAP's is fragile, so the centering itself is set from room-stage.tsx
 * instead of Tailwind.
 */
const STICKY_NOTES: {
  top: string;
  left: string;
  rotate: number;
  paper: string;
  text: string;
}[] = [
  {
    top: "10%",
    left: "6%",
    rotate: -8,
    paper: "#fde68a",
    text: "Think in\nSystems",
  },
  { top: "6%", left: "48%", rotate: 6, paper: "#f9a8d4", text: "Users\nFirst" },
  {
    top: "52%",
    left: "10%",
    rotate: 5,
    paper: "#93c5fd",
    text: "Iterate\nFast",
  },
  {
    top: "50%",
    left: "50%",
    rotate: -6,
    paper: "#86efac",
    text: "Details\nMatter",
  },
];

function StickyNote({
  top,
  left,
  rotate,
  paper,
  text,
}: (typeof STICKY_NOTES)[number]) {
  return (
    <div
      className="absolute"
      style={{
        top,
        left,
        width: "25%",
        aspectRatio: "1 / 1",
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {/* Pin — small metal thumbtack holding the note to the cork, slightly off-center like a real one would be pressed in. */}
      <div
        className="absolute z-10 rounded-full"
        style={{
          top: "-6%",
          left: "46%",
          width: "12%",
          aspectRatio: "1 / 1",
          background:
            "radial-gradient(circle at 35% 30%, #fff 0%, #d1d5db 35%, #6b7280 75%, #374151 100%)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.5)",
        }}
      />

      {/* Paper */}
      <div
        className="relative h-full w-full"
        style={{
          background: paper,
          boxShadow: "2px 4px 8px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        {/* Curled corner — a diagonal shade plus a lighter sliver mimics the underside of a lifted paper corner, the small imperfection that sells "real paper" over a flat rectangle. */}
        <div
          className="pointer-events-none absolute right-0 bottom-0"
          style={{
            width: "38%",
            height: "38%",
            background: `linear-gradient(135deg, transparent 45%, rgba(0,0,0,0.18) 46%, rgba(0,0,0,0.06) 60%, ${paper} 61%, ${paper} 100%)`,
          }}
        />

        {/* Handwritten marker text */}
        <div
          className={`${handwriting.className} absolute inset-0 flex items-center justify-center text-center leading-[0.95] whitespace-pre-line`}
          style={{
            color: "#1a1a1a",
            fontSize: "clamp(0.45rem, 0.85vw, 0.7rem)",
            padding: "10%",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

export const WallBoard = forwardRef<
  HTMLButtonElement,
  { onActivate: () => void }
>(function WallBoard({ onActivate }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onActivate}
      data-cursor="interactive"
      aria-label="Board — Think in Systems, Users First, Iterate Fast, Details Matter"
      className="group absolute border-0 bg-transparent p-0 outline-none"
      style={{ left: "66%", top: "35%", width: "7.5%", aspectRatio: "4 / 3" }}
    >
      {/* Hover/focus glow — same "brighten + soft glow" language as the invisible hotspots (see hotspot.tsx), but sized to the board's own footprint since it's a real asset. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-20%] -z-10 rounded-md opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40 group-focus-visible:opacity-40"
        style={{ background: "var(--primary)" }}
      />

      {/* Frame */}
      <div
        className="absolute inset-0 rounded-sm shadow-lg transition-[filter] duration-500 group-hover:brightness-110 group-focus-visible:brightness-110"
        style={{ background: "#8a5a34", padding: "4%" }}
      >
        {/* Cork surface — radial dot texture instead of a flat fill, so the board reads as cork rather than a plain tan rectangle even at a glance. */}
        <div
          className="relative h-full w-full rounded-[2px]"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(0,0,0,0.08) 0%, transparent 3%), radial-gradient(circle at 60% 70%, rgba(0,0,0,0.08) 0%, transparent 3%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.08) 0%, transparent 3%), #cda876",
          }}
        >
          {STICKY_NOTES.map((note) => (
            <StickyNote key={note.text} {...note} />
          ))}
        </div>
      </div>
    </button>
  );
});
WallBoard.displayName = "WallBoard";
