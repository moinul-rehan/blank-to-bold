import type { ReactNode } from "react";

/**
 * Topmost layer, reserved for development-only tooling. The Scene
 * System's `DebugMode` (`@/experience/debug-mode`) is one thing that
 * renders here — this layer has no opinion on what debug tooling looks
 * like, only where it sits.
 */
export function DebugLayer({ children }: { children?: ReactNode }) {
  return (
    <div
      aria-hidden={!children}
      className="pointer-events-none fixed inset-0 z-[var(--z-debug)]"
    >
      {children}
    </div>
  );
}
