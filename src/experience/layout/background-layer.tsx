import type { ReactNode } from "react";

/**
 * Persistent, full-viewport layer behind everything else. Empty by
 * default — a slot for a future ambient background, not a design
 * decision made here.
 */
export function BackgroundLayer({ children }: { children?: ReactNode }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[var(--z-base)]"
    >
      {children}
    </div>
  );
}
