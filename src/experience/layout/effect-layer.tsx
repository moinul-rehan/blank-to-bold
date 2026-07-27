import type { ReactNode } from "react";

/**
 * Full-viewport, non-interactive layer for decorative visual effects
 * (grain, particles, WebGL, etc.). Empty by default — no effect exists
 * yet, this only reserves where one would go.
 */
export function EffectLayer({ children }: { children?: ReactNode }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[var(--z-effect)]"
    >
      {children}
    </div>
  );
}
