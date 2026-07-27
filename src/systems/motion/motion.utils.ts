import {
  getDuration,
  type DurationToken,
} from "@/systems/motion/motion.tokens";

/** Duration token in seconds, collapsed to 0 under reduced motion. */
export function scaledDuration(
  token: DurationToken,
  reducedMotion: boolean,
): number {
  return reducedMotion ? 0 : getDuration(token);
}

/** Restricts a number to [min, max] — for scroll/drag progress math. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
