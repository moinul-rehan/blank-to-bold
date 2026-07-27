import { getDuration, getEase } from "@/systems/motion/motion.tokens";

/**
 * Timing for a scene-to-scene transition — one place, so every transition
 * in the experience feels consistent instead of each caller picking its
 * own duration/ease.
 */
export function getSceneTransitionTiming() {
  return {
    duration: getDuration("slow"),
    ease: getEase("decelerate"),
  };
}
