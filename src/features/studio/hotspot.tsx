"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Text } from "@/components/primitives/text";

export type HotspotProps = {
  x: number;
  y: number;
  title: string;
  subtitle: string;
  onActivate: () => void;
  /** Label defaults to the left; flip when a hotspot sits near the right edge. */
  align?: "left" | "right";
};

/**
 * The placeholder navigation marker for any object that doesn't have its
 * own illustrated asset yet — a dot + persistent label, same visual
 * language the reference used for its own navigation, not a degraded
 * fallback. Swap for the real object's own hover mechanic once it has an
 * asset (see `RoomObject`).
 */
export function Hotspot({ x, y, title, subtitle, onActivate, align = "left" }: HotspotProps) {
  const reducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onActivate}
      data-cursor="interactive"
      aria-label={`${title} — ${subtitle}`}
      className="group absolute -translate-x-1/2 -translate-y-1/2 border-0 bg-transparent p-0"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span
        aria-hidden
        className="border-background bg-background block size-3 rounded-full border-2 shadow-[0_0_0_4px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-125"
        style={{ animation: reducedMotion ? undefined : "hotspot-pulse 2.4s ease-in-out infinite" }}
      />
      <span
        className={`bg-background/90 border-border pointer-events-none absolute top-1/2 flex -translate-y-1/2 flex-col gap-0.5 rounded-md border px-3 py-2 whitespace-nowrap opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 ${
          align === "right" ? "right-full mr-3 items-end" : "left-full ml-3 items-start"
        }`}
      >
        <Text as="span" className="text-foreground text-xs font-medium">
          {title}
        </Text>
        <Text as="span" className="text-muted-foreground text-[0.65rem]">
          {subtitle}
        </Text>
      </span>
    </button>
  );
}
