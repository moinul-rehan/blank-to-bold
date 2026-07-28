"use client";

import { Text } from "@/components/primitives/text";

export type HotspotProps = {
  x: number;
  y: number;
  title: string;
  onActivate: () => void;
};

/**
 * An object's click target in the room — invisible at rest. Per the
 * "museum, not a website" direction: no visible buttons, no persistent
 * labels; discovery is part of the experience, the reward for exploring is
 * the hover glow + cursor change + tiny tooltip, not an always-on marker.
 * `focus-visible` mirrors the hover state so keyboard users aren't left
 * with zero affordance (invisible-until-hover shouldn't mean
 * invisible-until-focus too). Tooltip flips to sit below the point for
 * hotspots near the top edge (y < 18) so it doesn't clip off-screen.
 */
export function Hotspot({ x, y, title, onActivate }: HotspotProps) {
  const tooltipBelow = y < 18;

  return (
    <button
      type="button"
      onClick={onActivate}
      data-cursor="interactive"
      aria-label={title}
      className="group absolute -translate-x-1/2 -translate-y-1/2 border-0 bg-transparent p-0 outline-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: "2.75rem",
        height: "2.75rem",
      }}
    >
      {/* Hover/focus glow — the only "brightening" available until this object has its own real asset (see the desk/bookshelf/wall-board objects, which already do and can get a more targeted glow later). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 scale-100 rounded-full opacity-0 blur-xl transition-[opacity,transform] duration-500 group-hover:scale-105 group-hover:opacity-40 group-focus-visible:scale-105 group-focus-visible:opacity-40"
        style={{ background: "var(--primary)" }}
      />

      {/* Minimal tooltip — one line, no card, no persistent label. */}
      <span
        className={`bg-background/90 border-border pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full border px-3 py-1 whitespace-nowrap opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${
          tooltipBelow ? "top-full mt-3" : "bottom-full mb-3"
        }`}
      >
        <Text as="span" className="text-foreground text-[0.65rem] font-medium">
          {title}
        </Text>
      </span>
    </button>
  );
}
