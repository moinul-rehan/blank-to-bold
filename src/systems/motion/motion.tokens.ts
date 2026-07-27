/**
 * Reads motion tokens from CSS custom properties (defined in globals.css)
 * so duration/easing have one source of truth. Exists because GSAP needs
 * numeric seconds and its own ease identifiers — it can't consume a CSS
 * `transition-duration` or `cubic-bezier()` timing function directly.
 */

export type DurationToken = "fast" | "base" | "slow";
export type EaseToken = "standard" | "decelerate" | "accelerate" | "emphasized";

function readCssVar(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/** Parses a CSS time string ("150ms" / "0.15s") into seconds, for GSAP. */
function parseSeconds(value: string): number {
  if (value.endsWith("ms")) return parseFloat(value) / 1000;
  if (value.endsWith("s")) return parseFloat(value);
  return 0;
}

/** Duration token, in seconds — ready to pass to a GSAP tween's `duration`. */
export function getDuration(token: DurationToken): number {
  return parseSeconds(readCssVar(`--motion-duration-${token}`));
}

/**
 * GSAP has no notion of a CSS `cubic-bezier()` string, so each CSS ease
 * token is paired here with its nearest GSAP power-ease equivalent. The
 * canonical curve still lives in CSS (globals.css) — this is only an
 * adapter between the two representations, not a second source of truth.
 */
const GSAP_EASE_MAP: Record<EaseToken, string> = {
  standard: "power2.inOut",
  decelerate: "power2.out",
  accelerate: "power2.in",
  emphasized: "power3.out",
};

/** Ease token as a GSAP-compatible ease string. */
export function getEase(token: EaseToken): string {
  return GSAP_EASE_MAP[token];
}
