import type { ReactNode } from "react";

/**
 * Full-viewport, non-interactive layer for a custom cursor. Pointer
 * events pass through so it never blocks clicks on real content beneath
 * it. Empty by default — no cursor visual designed here.
 */
export function CursorLayer({ children }: { children?: ReactNode }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[var(--z-cursor)]"
    >
      {children}
    </div>
  );
}
