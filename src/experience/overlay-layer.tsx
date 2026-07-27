import type { ReactNode } from "react";

/**
 * Persistent, cross-scene layer above all scene content — a slot for
 * future UI (progress indicator, custom cursor, navigation) that
 * shouldn't be tied to any one scene. Empty and non-interactive by
 * default; content placed inside opts into `pointer-events-auto` itself.
 */
export function OverlayLayer({ children }: { children?: ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[var(--z-overlay)]">
      {children}
    </div>
  );
}
