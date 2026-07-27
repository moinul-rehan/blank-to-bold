# Product Blueprint

Every section is labeled **Confirmed** (sourced from an existing document,
cited) or **Pending** (genuinely undecided anywhere in the repo). Nothing
below is invented — where a section would otherwise require guessing, it
says so and stops.

## Vision — Confirmed

Source: [docs/00-project-vision.md](docs/00-project-vision.md)

> Blank to Bold is not a typical portfolio. It's an award-level interactive
> digital experience that presents Rehan's journey as a Product Designer
> through interaction, motion, exploration, and thoughtful storytelling.
> Treat it as a digital product, not a personal website.

## Mission — Confirmed (synthesized)

Source: combination of [docs/00](docs/00-project-vision.md) and
[docs/13-backend-architecture.md](docs/13-backend-architecture.md) — no
document states a "mission" verbatim; this is a direct combination of two
already-documented facts, not a new claim.

Two connected products: **Blank to Bold Experience** (public, renders
content, never hardcodes it) and **Blank to Bold Studio** (private, where
every piece of content is created and managed without touching code). The
mission is to give the creator a self-sufficient way to author his story
through Studio, and turn it into a public experience told through
interaction and motion rather than a static page.

## Product Philosophy — Confirmed

Source: [docs/01-design-principles.md](docs/01-design-principles.md),
[docs/13-backend-architecture.md](docs/13-backend-architecture.md).

- Every interaction must answer **"Why does this exist?"** — if there's no
  meaningful answer, remove it.
- The Experience only renders data; the Studio only creates/manages it —
  the frontend must never know or care where content comes from.
- One source of truth, applied consistently: design tokens live only in
  CSS ([Engineering Rule #001](docs/12-engineering-rules.md)); by the same
  discipline, product data is meant to live only behind the service layer,
  never duplicated.

## Product Principles — Confirmed

Source: [docs/01-design-principles.md](docs/01-design-principles.md),
unabridged, in order:

1. Experience before interface.
2. Story before decoration.
3. Motion with purpose.
4. Simplicity over complexity.
5. Performance over flashy effects.
6. Accessibility is mandatory.
7. Desktop-first, but fully responsive.
8. Every interaction should feel intentional.
9. Never copy another portfolio.
10. Build original systems.

## Product Goals — Confirmed (technical/process goals only)

Source: [docs/00-project-vision.md](docs/00-project-vision.md) "Guiding
constraint," [docs/10-roadmap.md](docs/10-roadmap.md).

- Engineered "with the same care as a high-quality SaaS product," expected
  to evolve over time.
- Think in systems, not pages; don't rush into building pages before the
  technical foundation is solid.
- Ship an Experience that never hardcodes content, backed by a Studio the
  creator can fully operate without touching code.

These are process/engineering goals. Outcome-level product goals depend on
the Honest Goal below, which is pending.

## Honest Goal — Pending

**Not documented anywhere in the repo.** This is the real, unvarnished
reason the project exists for its creator — separate from the polished
Vision statement above. No file states it. Naming a guess here (career
change, job search, portfolio replacement, personal pride) would be
inventing information, which this document is not permitted to do.
**Needs direct input from Rehan.**

## Business Goal — Pending

**Not documented anywhere in the repo.** Whether this project is meant to
generate income, leads, employment, or has no commercial goal at all is
unstated. See [docs/18-product-definition.md](docs/18-product-definition.md)
§4, which identifies this exact gap. **Needs direct input from Rehan.**

## Long-term Goal — Pending

**Not documented anywhere in the repo.** No document describes what Blank
to Bold is meant to become beyond the current build (e.g. an ongoing
content platform updated for years, a one-time launch piece, a template
for future projects). **Needs direct input from Rehan.**

## Success Metrics — Partially Confirmed / Mostly Pending

**Confirmed:** "Target an excellent Lighthouse score" —
[docs/01-design-principles.md](docs/01-design-principles.md#performance-budget).
A technical/quality metric, not a product-outcome metric.

**Pending:** no product or business success metric exists anywhere
(conversion, engagement, inquiries generated, published content volume,
etc.) — a direct consequence of the Business/Honest/Long-term Goals above
being unset. **Needs direct input from Rehan**, after the goals are
defined.

## Constraints — Confirmed

Source: cross-referenced from docs/00, 01, 13, and
[CONTEXT.md](CONTEXT.md).

- Solo creator/operator — single-user Studio, no team workflow, a
  deliberate choice.
- Originality constraint — never copy another portfolio; every system is
  purpose-built.
- Desktop-first design, with a hard requirement to still fully work on
  mobile/tablet.
- Accessibility is a hard constraint, never traded away for a visual
  effect.
- Technical constraints: Next.js App Router + Vercel deployment,
  PostgreSQL + Prisma, Better Auth for Studio auth.

**Pending:** timeline/deadline, budget, and whether an external stakeholder
(employer, client) has a delivery date — nothing in the repo states any
date-driven constraint.

## Open Questions — Confirmed list (all currently unresolved)

Source: [CONTEXT.md](CONTEXT.md) "Open decisions" +
[docs/18-product-definition.md](docs/18-product-definition.md) §15, merged.

- Target audience
- User problem(s) being solved
- User personas
- Honest / business / long-term goal
- Success metrics
- Story architecture (narrative arc, chapters/acts, tone)
- Brand direction (color, voice, identity)
- Typography

---

## Confirmed Decisions (summary)

- Two-product architecture: Experience (public, read-only) + Studio
  (private, manages content) — [docs/13](docs/13-backend-architecture.md).
- Single Next.js app, route groups, not a monorepo (with a documented
  future extraction path) — [docs/13](docs/13-backend-architecture.md).
- Better Auth, single-user, no roles system yet —
  [CONTEXT.md](CONTEXT.md).
- PostgreSQL + Prisma + Zod, superseding the earlier Sanity CMS plan —
  [docs/02-tech-stack.md](docs/02-tech-stack.md).
- Design tokens are CSS-first, single source of truth, never duplicated in
  TypeScript — [Engineering Rule #001](docs/12-engineering-rules.md).
- All 10 Design Principles and the Interaction Philosophy —
  [docs/01](docs/01-design-principles.md).
- Working relationship: Claude Code now covers product thinking and
  engineering; ChatGPT is no longer involved — [CLAUDE.md](CLAUDE.md).

## Pending Decisions (summary)

- Honest Goal, Business Goal, Long-term Goal
- Success Metrics (product-level)
- Target Audience, User Problems, User Personas
- Story Architecture
- Brand Direction, Typography
- Timeline/budget/external stakeholder constraints, if any

All of the above require direct input from Rehan — none can be responsibly
filled in by inference from what's already written, because nothing
written addresses them even indirectly.
