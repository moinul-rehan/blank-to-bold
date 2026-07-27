import type { ReactNode } from "react";

/**
 * Persistent, fixed navigation slot above scene content. Structural
 * placement only (top strip, the conventional home for navigation) — no
 * nav content or visual design decided here.
 */
export function NavigationLayer({ children }: { children?: ReactNode }) {
  return (
    <div className="fixed inset-x-0 top-0 z-[var(--z-navbar)]">{children}</div>
  );
}
