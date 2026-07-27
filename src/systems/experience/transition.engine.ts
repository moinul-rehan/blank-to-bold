import { getDuration, getEase } from "@/systems/motion/motion.tokens";
import type {
  SceneTransition,
  SceneTransitionType,
} from "@/systems/experience/scene.types";

type TweenVars = Record<string, number>;

/** Starting state per transition type. The end state is always `TRANSITION_TO`. */
const TRANSITION_FROM: Record<SceneTransitionType, TweenVars> = {
  fade: { opacity: 0 },
  slide: { opacity: 0, y: 24 },
  scale: { opacity: 0, scale: 0.98 },
  none: {},
};

export const TRANSITION_TO: TweenVars = { opacity: 1, y: 0, scale: 1 };

/**
 * Turns a scene's declared transition into concrete tween values. Duration
 * and ease fall back to the shared defaults so a scene only specifies what
 * it wants to differ.
 */
export function resolveSceneTransition(transition: SceneTransition) {
  return {
    from: TRANSITION_FROM[transition.type],
    duration: getDuration(transition.duration ?? "slow"),
    ease: getEase(transition.ease ?? "decelerate"),
  };
}
