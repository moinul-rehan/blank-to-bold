# 11 — Design Tokens

Governed by [Engineering Rule #001](./12-engineering-rules.md#rule-001--one-source-of-truth-for-design-tokens):
one source of truth, CSS only, TS/JS reads at runtime when it genuinely
needs a value.

Single source of truth: **CSS custom properties in
[`src/app/globals.css`](../src/app/globals.css)**. Tailwind v4 is CSS-first,
so this is the idiomatic home for tokens — not a parallel TypeScript config.
Tokens are not duplicated into TS; where JS genuinely needs a value (GSAP
durations), a small utility reads the CSS variable instead of maintaining a
second source of truth (see
[`motion.tokens.ts`](../src/systems/motion/motion.tokens.ts)).

## A Tailwind v4 gotcha that shapes this file

`@theme { ... }` variables are only kept in the compiled CSS if some utility
class actually uses them — Tailwind tree-shakes the rest. That's fine for
values only ever consumed through a utility class, but it silently breaks
anything that reads the variable at runtime (`getComputedStyle`) or via an
arbitrary value before any such utility exists yet.

So: tokens that must **always** exist (read by `motion.tokens.ts`, or
referenced via `[var(--x)]` arbitrary values) are declared as **plain
`:root` custom properties**, never inside `@theme`. Where a token should
also be usable as a real Tailwind utility class (e.g. `duration-fast`), it's
mirrored into `@theme inline` under Tailwind's expected key — using a
different variable name than the `:root` source (`--motion-duration-fast` →
`--duration-fast`) to avoid a self-reference cycle, the same pattern shadcn
already uses for colors (`--background` → `--color-background`).

## Catalog

| Category            | Tokens                                                                  | Defined in                                  | Notes                                                                                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Color               | `--background`, `--foreground`, `--primary`, `--card`, `--border`, etc. | `:root` / `.dark` → `@theme inline`         | shadcn-generated, neutral placeholder palette pending brand direction.                                                                                                                                    |
| Radius              | `--radius`, `--radius-sm…4xl`                                           | `:root` → `@theme inline`                   | shadcn default.                                                                                                                                                                                           |
| Typography (weight) | Tailwind's built-in `font-normal/medium/semibold/bold` utilities        | Tailwind default                            | Not redefined — Tailwind v4 already ships a `--font-weight-*` scale. The type _size_ scale is still Tailwind's default until a scale is decided.                                                          |
| Spacing             | Tailwind's built-in `--spacing` scale                                   | Tailwind default                            | Not redefined — already a token system.                                                                                                                                                                   |
| Layout              | `--layout-gutter`, `--layout-max-width`, `--layout-header-height`       | `:root` (plain)                             | Shared rhythm for the app shell (Navbar/Main/Footer). Used via arbitrary values, e.g. `h-[var(--layout-header-height)]`.                                                                                  |
| Elevation           | `--elevation-1…3` → `--shadow-elevation-1…3`                            | `:root` (plain) / `.dark` → `@theme inline` | Light and dark redefine `--elevation-*` independently — a light-mode shadow is nearly invisible on a dark surface.                                                                                        |
| Blur                | Tailwind's built-in `blur-*` scale                                      | Tailwind default                            | Not redefined.                                                                                                                                                                                            |
| Opacity             | `--opacity-disabled`, `--opacity-muted`, `--opacity-overlay`            | `:root` (plain)                             | Semantic names, used via arbitrary values (`opacity-[var(--opacity-disabled)]`) rather than replacing Tailwind's numeric opacity scale.                                                                   |
| Motion duration     | `--motion-duration-fast/base/slow` → `--duration-fast/base/slow`        | `:root` (plain) → `@theme inline`           | Read by `motion.tokens.ts` for GSAP; also usable as Tailwind's `duration-*` utilities.                                                                                                                    |
| Motion easing       | `--motion-ease-standard/decelerate/accelerate/emphasized` → `--ease-*`  | `:root` (plain) → `@theme inline`           | CSS `cubic-bezier()` — canonical curve. `motion.tokens.ts`'s `getEase()` maps each _name_ to its nearest GSAP power-ease; it doesn't parse this CSS value (GSAP can't consume a `cubic-bezier()` string). |
| Z-index             | `--z-base/navbar/overlay/modal/cursor/toast`                            | `:root` (plain)                             | Reserved scale — not yet consumed anywhere (no sticky nav/modal exists yet).                                                                                                                              |

## Rules

- If Tailwind already ships a default scale for something (spacing, blur,
  font-weight, opacity's numeric values), don't redefine it — that's already
  a token system.
- A token that must always exist (runtime-read or referenced via arbitrary
  values) goes in plain `:root`, never bare inside `@theme` — see the
  gotcha above.
- New tokens only get added when there's a real, current need for them (no
  speculative categories) — consistent with
  [04-coding-standards.md](./04-coding-standards.md)'s "no over-engineering"
  rule.
- Colors/typography here are neutral placeholders — see
  [CONTEXT.md](../CONTEXT.md) for what's still pending from the Product
  Architect (brand, experience, story direction) before these get their real
  values.
