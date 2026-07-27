import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getDuration, getEase } from "@/systems/motion/motion.tokens";

let initialized = false;

/**
 * Registers GSAP plugins and applies project-wide tween defaults. Safe to
 * call multiple times — only runs once. Called from AnimationProvider so
 * every consumer of GSAP in the app inherits the same baseline.
 */
export function initMotion() {
  if (initialized) return;
  initialized = true;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({
    duration: getDuration("base"),
    ease: getEase("standard"),
  });
}

export { ScrollTrigger };
