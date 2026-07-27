import type { ReactNode } from "react";

/**
 * Non-visual layer for sound-related elements (a future mute toggle,
 * audio elements). Unlike the other layers, sound has no viewport
 * footprint of its own — no fixed positioning or z-index is imposed;
 * whatever's placed here controls its own layout.
 */
export function SoundLayer({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <>{children}</>;
}
