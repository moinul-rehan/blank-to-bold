# 12 — Engineering Rules

Numbered, durable engineering rules for this codebase — narrower and more
binding than the general guidance in
[04-coding-standards.md](./04-coding-standards.md). Once a rule is added
here, it applies to all future code, not just the change that introduced it.

## Rule #001 — One Source of Truth for Design Tokens

Design tokens live in CSS custom properties. TypeScript/JavaScript never
redefines them.

If JavaScript or GSAP needs a token value, create a small helper that reads
the CSS custom property from the document root at runtime — don't hardcode
a parallel value in TS.

**Why:** two representations of the same value drift. CSS is the correct
home for tokens under Tailwind v4's CSS-first model (see
[11-design-tokens.md](./11-design-tokens.md)); GSAP just can't consume CSS
timing functions directly, so an adapter is unavoidable for motion — but
that adapter must read the CSS value, never restate it.

**Reference implementation:**
[`motion.tokens.ts`](../src/systems/motion/motion.tokens.ts) — `getDuration()`
reads `--motion-duration-*` via `getComputedStyle` and parses it to seconds
for GSAP. `getEase()` is the one narrow exception: GSAP has no way to
consume a CSS `cubic-bezier()` string at all, so each ease _name_ (not its
value) is mapped to the nearest GSAP power-ease as a naming adapter — the
canonical curve itself still lives only in CSS.

**How to apply:** before adding any token-like constant to a `.ts`/`.tsx`
file (colors, spacing, durations, easings, radii, opacity, z-index, etc.),
check whether it should instead be a CSS custom property in `globals.css`,
read at runtime if JS needs it.
