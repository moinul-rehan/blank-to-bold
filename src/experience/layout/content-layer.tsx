import type { ReactNode } from "react";

/**
 * Where actual page content renders. The only one of the nine layers in
 * normal document flow — the rest are fixed overlays — so it contributes
 * to page height and scrolls normally, and works standalone even without
 * a TransitionLayer parent.
 */
export function ContentLayer({ children }: { children: ReactNode }) {
  return <div className="relative z-[var(--z-content)]">{children}</div>;
}
