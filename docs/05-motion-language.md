# 05 — Motion Language

## Principles

Animation should feel:

- Elegant
- Confident
- Smooth
- Intentional

## Avoid

- Random floating
- Unnecessary spinning
- Excessive parallax
- Motion for the sake of motion

Every animation must communicate something. If it doesn't reinforce the
story, hierarchy, or feedback being given to the user, it doesn't belong.

## System boundary

- GSAP + Lenis are initialized once, through a top-level motion/scroll system
  (`systems/motion/`), not imported ad hoc inside individual components.
  - `motion.config.ts` — registers GSAP plugins (ScrollTrigger) and applies
    project-wide tween defaults. Called once from `AnimationProvider`.
  - `motion.tokens.ts` — reads duration/easing from the CSS custom
    properties in `globals.css` (the single source of truth — see
    [11-design-tokens.md](./11-design-tokens.md)) and adapts them into
    GSAP-compatible values (seconds, GSAP ease names). GSAP can't consume a
    CSS `cubic-bezier()` timing function directly, so this is an adapter,
    not a second source of truth for the curves themselves.
  - `motion.utils.ts` — small pure helpers (`scaledDuration`, `clamp`).
- Reusable animation definitions/timelines live in `animations/` and get
  composed by `features/`, rather than writing one-off GSAP calls inline
  throughout the codebase.
- All motion must respect `prefers-reduced-motion` — enforced at the system
  level (`AnimationProvider` collapses default tween duration to 0) via
  `hooks/use-reduced-motion.ts`, not opted into per-animation.

## Open questions (to define with Product Architect)

- Signature motion "voice" for this project — what should distinguish this
  site's motion from a generic GSAP portfolio?
- Timing/easing vocabulary (a shared set of durations/eases used throughout,
  rather than ad hoc values per animation).
- Scroll-driven vs. click/hover-driven interaction balance.

These will get filled in as the interaction library
([06-interaction-library.md](./06-interaction-library.md)) takes shape.
