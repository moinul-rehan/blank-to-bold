import type { ReactNode } from "react";

/**
 * The positioning context content transitions happen inside. Generic and
 * content-agnostic on purpose — it doesn't know what's transitioning or
 * why. The Scene System's `SceneTransitionManager`
 * (`@/experience/scene-transition-manager`) supplies that logic and
 * renders inside this layer's children, keeping the two isolated: this
 * layer works with or without the Scene System present.
 */
export function TransitionLayer({ children }: { children: ReactNode }) {
  return <div className="relative z-[var(--z-transition)]">{children}</div>;
}
