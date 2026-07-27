# Project Understanding

A synthesis of the entire repository as it stands on 2026-07-27 — every
claim below is sourced from an existing file, not inferred or assumed.
Written to answer one question: *does the project actually understand
itself, end to end?*

## What Blank to Bold is

Blank to Bold is not a typical portfolio — it's described in
[docs/00-project-vision.md](docs/00-project-vision.md) as "an award-level
interactive digital experience that presents Rehan's journey as a Product
Designer through interaction, motion, exploration, and thoughtful
storytelling," treated as a digital product, not a personal website.

Structurally, it's **two connected products** ([docs/13-backend-architecture.md](docs/13-backend-architecture.md)):

- **Blank to Bold Experience** — the public site. Renders content. Never
  hardcodes it.
- **Blank to Bold Studio** — a private creator platform where the content
  (projects, case studies, career timeline, blog, playground, media, site
  settings) is created, edited, and managed without touching code.

Everything the Experience shows is meant to come from a database, through
Studio, via a typed service layer — never a literal value in a component.

## Why it exists

The repository documents the *feeling* the project is reaching for and the
*mechanism* it uses to get there, but not yet the underlying motivation.

Documented ("the feeling we're building toward," [docs/00](docs/00-project-vision.md)):
- Visitors should feel like they're exploring an interactive story, not
  browsing a portfolio.
- Every section should encourage curiosity; every interaction should have
  a purpose; every animation should support storytelling.
- The experience should be memorable without becoming confusing.

**Not documented anywhere:** the actual reason this exists for its
creator — career opportunities, freelance leads, a personal creative
record, or something else. [docs/18-product-definition.md](docs/18-product-definition.md)
§4 identifies this explicitly as an open gap, not a fact this document can
report.

## What makes it different

Documented as explicit principles, not just intent
([docs/01-design-principles.md](docs/01-design-principles.md)):
- **Never copy another portfolio** — reference for inspiration, not
  reproduction.
- **Build original systems** — reusable, named systems, not one-off
  effects bolted onto a page.
- **Experience before interface, story before decoration** — the feeling
  of moving through the site matters more than any single screen.
- **Everything is data-driven, nothing hardcoded** — a structural
  difference from a typical static portfolio, not just a stylistic one;
  the creator manages all content through Studio, never by editing code
  ([docs/13](docs/13-backend-architecture.md)).

What this differentiation is *for* (i.e. why it matters to whoever visits)
is not yet documented — see [docs/18](docs/18-product-definition.md) §8
(Value Proposition), which is explicitly marked partial for this reason.

## Current project status

Per [CONTEXT.md](CONTEXT.md) (the authoritative, continuously updated
status document — always check it first):

- **Phase 0 (Technical Foundation):** complete.
- **Phase 2 (Core Systems):** a first slice built ahead of schedule — app
  shell, four frontend systems (motion/interaction/cursor/theme), design
  tokens.
- **Phase 1.5 (Backend Architecture & Creator Studio):** fully designed
  (docs/13–16, plus a draft `prisma/schema.prisma`), **not implemented** —
  explicitly awaiting approval before any Prisma/Better Auth/Studio code
  gets written.
- **Sprint 1.1 (Foundation Finalization):** complete — `.env.example`
  added, two speculative empty folders removed, documentation
  contradictions fixed, [docs/17-engineering-review.md](docs/17-engineering-review.md)
  written.
- **Sprint 2 (Product Definition):** complete —
  [docs/18-product-definition.md](docs/18-product-definition.md) written;
  verdict was **not enough is known about the product to start Sprint 3
  architecture**.
- **Working relationship change (2026-07-27):** ChatGPT is no longer part
  of the project. Claude Code now covers both product thinking and
  engineering — see [CLAUDE.md](CLAUDE.md)'s Roles section.
- `pnpm build` / `lint` / `typecheck` all pass; the dev server has been
  verified in-browser with no console/network errors, most recently after
  the Sprint 1.1 changes.

## Existing architecture

**Frontend** (built, real code — see
[docs/03-folder-architecture.md](docs/03-folder-architecture.md)):
- Next.js (App Router) + TypeScript (strict) + Tailwind v4, CSS-first
  (`globals.css` is the single source of truth for design tokens — see
  [Engineering Rule #001](docs/12-engineering-rules.md) and
  [docs/11-design-tokens.md](docs/11-design-tokens.md)).
- Four systems (`src/systems/`) — motion, interaction, cursor, theme —
  each following an **engine / store / provider** split: pure
  framework-agnostic logic in an `*.engine.ts`, reactive state in a
  Zustand store where needed, React wiring in a provider. Documented as a
  named, repeatable pattern in
  [docs/03](docs/03-folder-architecture.md#systems-the-engineprovider-store-split).
- Six global providers composed in `AppProviders`: `ThemeProvider`,
  `AnimationProvider`, `LenisProvider`, `CursorProvider`, `SoundProvider`,
  `ExperienceProvider`.
- App shell (`Navbar`/`Main`/`Footer`/`AppShell`) — structural only, no
  visual design yet (blocked on brand direction).
- `src/app/page.tsx` is still the unmodified `create-next-app` boilerplate
  — no real page has been built, by explicit instruction ("don't rush into
  building pages before the technical foundation is solid").

**Backend** (designed only — see
[docs/13](docs/13-backend-architecture.md)–[16](docs/16-studio-modules.md),
zero code exists):
- Single Next.js app, `(experience)`/`(studio)` route groups — not a
  monorepo, a deliberate choice with a documented extraction path if ever
  needed.
- A service layer (`src/services/`) is designed to be the *only* code that
  imports Prisma — both Studio's Route Handlers and Experience's Server
  Components would go through it.
- PostgreSQL + Prisma schema drafted (`prisma/schema.prisma`, not
  migrated) — covers Projects, a polymorphic `ContentBlock` system
  (additive block types without migrations), Career Timeline, Blogs,
  Playground, Media Library, and enforced-singleton settings tables.
- Better Auth designed for Studio, single-user, no roles/permissions yet.
- Nine Studio modules mapped to schema + API in
  [docs/16](docs/16-studio-modules.md): Dashboard, Projects, Case Study
  Builder, Career Timeline, Blogs, Playground, Media Library, Global
  Settings, Experience Settings.

## Current risks

Documented explicitly in [docs/17-engineering-review.md](docs/17-engineering-review.md):

1. **Nothing in the project is committed to git.** `git log` reports zero
   commits. This is called the single highest-severity risk in the repo,
   independent of code quality — still unresolved as of the latest
   session log entry.
2. Zero automated tests, zero CI — no automated checkpoint confirms the
   project builds before it's relied upon.
3. The backend design (docs/13–16) is thorough but has never been
   exercised by real code — a real risk that something looks right on
   paper and proves awkward once implemented.
4. A known, unfixed duplication: `AnimationProvider` and `LenisProvider`
   each independently detect reduced-motion preference instead of
   `LenisProvider` reading it from `AnimationProvider`'s context — small,
   but flagged as technical debt rather than silently accepted.
5. Tailwind v4's `@theme` tree-shaking (already caused and fixed one bug —
   see [docs/11](docs/11-design-tokens.md)) is a manual discipline, not an
   enforced guardrail; a careless future token addition could reintroduce
   it.

Product-level risks, from [docs/18](docs/18-product-definition.md) §16:
building the wrong experience without a defined audience; content never
getting populated if the single-operator Studio isn't actually used;
brand/typography delay calcifying the current placeholder theme into a de
facto default by inertia.

## Missing decisions

From [docs/18-product-definition.md](docs/18-product-definition.md)'s
Product Readiness Report, in dependency order (each blocks the ones below
it):

1. Target audience — who this is for.
2. User problem — what problem it solves for them.
3. User personas — depends on 1–2.
4. Underlying product/business goal.
5. Success metrics — depends on 4.
6. Story architecture — the narrative arc; depends on 1–3.
7. Brand direction — colors, typography, voice.
8. Typography specifically.

**Explicitly not blocked by any of the above:** the backend validation
slice recommended in [docs/17](docs/17-engineering-review.md) (Prisma
install, one migration, one real service, one Route Handler) — that's
infrastructure, already designed, and was only out of scope by
instruction, not by dependency.

## Suggested reading order for future developers

1. **[CLAUDE.md](CLAUDE.md)** — entry point, roles, non-negotiable rules.
2. **[CONTEXT.md](CONTEXT.md)** — current status, always read this before
   anything else changes; the session log is the project's memory.
3. **[docs/00-project-vision.md](docs/00-project-vision.md)** →
   **[01-design-principles.md](docs/01-design-principles.md)** — what this
   is and the rules that shape every decision.
4. **[docs/02-tech-stack.md](docs/02-tech-stack.md)** →
   **[03-folder-architecture.md](docs/03-folder-architecture.md)** →
   **[04-coding-standards.md](docs/04-coding-standards.md)** — the
   technical shape of the codebase.
5. **[docs/05](docs/05-motion-language.md)–[06](docs/06-interaction-library.md)** —
   motion/interaction philosophy (06 is currently a template, not yet
   populated).
6. **[docs/07-story-architecture.md](docs/07-story-architecture.md)** →
   **[08-scene-map.md](docs/08-scene-map.md)** — both currently
   placeholders; read to understand *what's missing*, not what's decided.
7. **[docs/09-component-system.md](docs/09-component-system.md)** — the
   handful of components that exist so far.
8. **[docs/10-roadmap.md](docs/10-roadmap.md)** — phase-by-phase plan;
   cross-check against CONTEXT.md for current phase.
9. **[docs/11-design-tokens.md](docs/11-design-tokens.md)** →
   **[12-engineering-rules.md](docs/12-engineering-rules.md)** — the token
   system and the one formalized engineering rule (single source of
   truth, no duplication).
10. **[docs/13](docs/13-backend-architecture.md)–[16](docs/16-studio-modules.md)** —
    the full backend design, read in order (architecture → schema → API →
    modules).
11. **[docs/17-engineering-review.md](docs/17-engineering-review.md)** —
    the honest self-assessment: strengths, weaknesses, technical debt,
    risks.
12. **[docs/18-product-definition.md](docs/18-product-definition.md)** —
    what's actually known about the *product*, and what still isn't.
13. **This document and `PRODUCT_BLUEPRINT.md`** — a synthesized entry
    point once 1–12 have been read once; not a replacement for them.
