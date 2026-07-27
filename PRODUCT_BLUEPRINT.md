# Product Blueprint

Every section is labeled **Confirmed** (sourced from an existing document
or from Rehan's direct answers in conversation, cited) or **Pending**
(genuinely undecided). Nothing below is invented — where a section would
otherwise require guessing, it says so and stops.

> Updated 2026-07-27: Vision, Honest/Business/Long-term Goal, Target
> Audience, and a qualitative Success Metric moved from Pending to
> Confirmed, based on Rehan's direct answers. See
> [docs/18-product-definition.md](docs/18-product-definition.md) for the
> full reasoning behind each.

## Vision — Confirmed (refined 2026-07-27)

Source: [docs/00-project-vision.md](docs/00-project-vision.md).

> Blank to Bold is an interactive product experience that transforms a
> portfolio from a collection of projects into a memorable journey through
> a designer's way of thinking.

Guiding sentence for every future decision:

> Blank to Bold exists to help people experience how I think as a product
> designer — not just view the work I've created.

If a feature doesn't help someone understand the thinking behind the work,
or contribute to a memorable journey, it probably doesn't belong.

## Mission — Confirmed (synthesized)

Source: combination of [docs/00](docs/00-project-vision.md) and
[docs/13-backend-architecture.md](docs/13-backend-architecture.md).

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

## Product Goals — Confirmed

Source: [docs/00-project-vision.md](docs/00-project-vision.md), Rehan's
answers 2026-07-27 (full detail in
[docs/18-product-definition.md](docs/18-product-definition.md) §4).

**Engineering/process goals:**

- Engineered "with the same care as a high-quality SaaS product," expected
  to evolve over time.
- Think in systems, not pages; don't rush into building pages before the
  technical foundation is solid.
- Ship an Experience that never hardcodes content, backed by a Studio the
  creator can fully operate without touching code.

**Outcome goals:** see Honest Goal, Business Goal, and Long-term Goal
below.

## Honest Goal — Confirmed (2026-07-27)

Not to impress people with animations — to help people understand _how
Rehan thinks_, not just what he designed. A static portfolio only shows
the final result; Blank to Bold is meant to show the decisions, the
reasoning, the failures, the iterations, and the product thinking behind
every project.

## Business Goal — Confirmed (2026-07-27)

Two layers:

- **Professional:** get hiring managers to spend _minutes_ exploring the
  work instead of _seconds_ scanning it — success is someone remembering
  Rehan's way of thinking after closing the browser.
- **Career:** shift perception from "a UI designer" to "a Product Designer
  who understands systems, user experience, engineering, and
  storytelling."

## Long-term Goal — Confirmed (2026-07-27)

Blank to Bold is not just a portfolio — it's the foundation of a personal
brand. Over time it's meant to grow into a platform publishing case
studies, design thinking, product experiments, articles, talks,
open-source design resources, and personal journey content. The portfolio
is the first chapter, not the final product. (Already validated by the
Blog/Playground/Career-Timeline modules designed in
[docs/16-studio-modules.md](docs/16-studio-modules.md) — no architecture
change needed to support this.)

## Success Metrics — Partially Confirmed

**Qualitative (confirmed 2026-07-27):** if someone remembers Rehan's way
of thinking after closing the browser, the portfolio has succeeded.
Deliberately not a number.

**Technical (confirmed earlier):** "Target an excellent Lighthouse score" —
[docs/01-design-principles.md](docs/01-design-principles.md#performance-budget).

**Pending:** a quantitative product metric (time-on-page, inquiries
generated, return visits, etc.) — not blocking, since the qualitative bar
above is a real and sufficient success definition on its own, but worth
deciding if analytics/measurement work is ever wanted.

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

## Open Questions

Source: [docs/18-product-definition.md](docs/18-product-definition.md)
§15, updated 2026-07-27.

**Still open:**

- Story architecture (narrative arc, chapters/acts, tone) — now has real
  seed material from the Honest Goal above, but not yet written.
- Brand direction (color, voice, identity) and typography.
- User personas — deferred by choice (small, well-scoped, not blocking).
- Quantitative success metrics — non-blocking.
- Timeline/budget/external stakeholder constraints, if any.

**Resolved 2026-07-27:** target audience, user problem(s), honest/business/
long-term goal, value proposition, qualitative success metric.

---

## Confirmed Decisions (summary)

- **Vision, refined:** "an interactive product experience that transforms
  a portfolio... into a memorable journey through a designer's way of
  thinking" — replaces the earlier, more generic "interactive portfolio"
  framing.
- **Target audience:** Primary (80%) hiring managers/design
  leads/directors; Secondary (15%) founders/startups/freelance clients;
  Tertiary (5%) designers/students/community. Full detail in
  [docs/18](docs/18-product-definition.md) §5.
- **Honest, business, and long-term goals** — see above.
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

- Story Architecture
- Brand Direction, Typography
- User Personas (deferred by choice)
- Quantitative success metrics (non-blocking)
- Timeline/budget/external stakeholder constraints, if any

All require direct input from Rehan when wanted — none can be responsibly
filled in by inference.
