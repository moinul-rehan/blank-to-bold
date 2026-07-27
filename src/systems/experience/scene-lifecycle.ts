/**
 * A scene's lifecycle state. Supersedes the earlier `TransitionPhase` —
 * one state machine instead of two overlapping ones, since loading and
 * transitioning are phases of the same journey.
 */
export type SceneLifecycleState =
  "idle" | "loading" | "entering" | "active" | "exiting" | "error";

const VALID_TRANSITIONS: Record<SceneLifecycleState, SceneLifecycleState[]> = {
  idle: ["loading"],
  loading: ["entering", "error"],
  entering: ["active", "exiting"],
  active: ["exiting"],
  exiting: ["idle", "loading"],
  error: ["loading", "idle"],
};

/** Whether a lifecycle transition is legal. Guards against out-of-order state writes. */
export function canTransition(
  from: SceneLifecycleState,
  to: SceneLifecycleState,
): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

/** True while the scene is doing something that should block new navigation. */
export function isBusy(state: SceneLifecycleState): boolean {
  return state === "loading" || state === "entering" || state === "exiting";
}
