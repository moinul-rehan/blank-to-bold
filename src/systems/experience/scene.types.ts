import type { ComponentType } from "react";
import type { DurationToken, EaseToken } from "@/systems/motion/motion.tokens";
import type { CursorVariant } from "@/systems/cursor/cursor.types";

export type SceneId = string;

/**
 * How a scene's component is fetched.
 * - `eager`: bundled with the shell, available immediately.
 * - `lazy`: code-split, fetched when the scene is first activated.
 * - `preload`: code-split, but fetched ahead of activation (e.g. once the
 *   previous scene settles) so the transition doesn't wait on the network.
 */
export type SceneLoadingStrategy = "eager" | "lazy" | "preload";

/** How a scene visually replaces the previous one. */
export type SceneTransitionType = "fade" | "slide" | "scale" | "none";

export type SceneTransition = {
  type: SceneTransitionType;
  duration?: DurationToken;
  ease?: EaseToken;
};

/**
 * A scene's own entrance/exit choreography — distinct from `transition`,
 * which is the crossfade *between* scenes. A scene can fade in as a whole
 * (transition) while its contents stagger upward (enter animation).
 */
export type SceneAnimation = {
  /** Named animation, resolved by the animation registry when scenes are built. */
  preset: string;
  duration?: DurationToken;
  ease?: EaseToken;
  /** Seconds to wait before starting. */
  delay?: number;
};

/**
 * Background is described, never hardcoded — a scene declares intent and
 * the renderer resolves it. `token` refers to a CSS custom property name
 * (e.g. "background", "card"), keeping Engineering Rule #001 intact.
 */
export type SceneBackground =
  | { kind: "token"; token: string }
  | { kind: "transparent" }
  | { kind: "custom"; component: ComponentType };

/**
 * Per-scene interaction rules. The interaction/cursor systems read this
 * rather than each scene wiring its own listeners.
 */
export type SceneInteractionProfile = {
  cursor?: CursorVariant;
  /** Whether Lenis smooth scroll is active while this scene is showing. */
  scroll?: "enabled" | "locked";
  /** Whether keyboard next/previous navigation applies to this scene. */
  keyboardNavigation?: boolean;
};

export type SceneDefinition = {
  id: SceneId;
  title: string;
  /** Position in the experience. The registry sorts by this, not by insertion order. */
  order: number;
  /** URL segment this scene is addressable at, if any. */
  route: string;
  transition: SceneTransition;
  loadingStrategy: SceneLoadingStrategy;
  enterAnimation?: SceneAnimation;
  exitAnimation?: SceneAnimation;
  background: SceneBackground;
  interactionProfile?: SceneInteractionProfile;
  /**
   * Resolves the scene's component. Always a function so `lazy`/`preload`
   * scenes can be code-split via dynamic import; `eager` scenes just
   * return an already-imported component.
   */
  component: () => Promise<{ default: ComponentType }> | ComponentType;
};
