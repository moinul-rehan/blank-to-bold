# 10 — Roadmap

High-level milestones. For fine-grained current status, see
[CONTEXT.md](../CONTEXT.md) — this doc is the phase-level plan, CONTEXT.md is
the up-to-the-minute state.

## Phase 0 — Technical Foundation (complete)

- [x] Vision, principles, stack, and architecture documented (`docs/`)
- [x] Package manager decided (pnpm)
- [x] Next.js app scaffolded (App Router, TS, Tailwind, ESLint, `src/`, alias)
- [x] Git initialized
- [x] shadcn/ui initialized as primitive foundation
- [x] GSAP, @gsap/react, Lenis, Zustand, Lucide, clsx/cva/tailwind-merge
      installed
- [x] Base folder structure created
- [x] Strict `tsconfig.json`
- [x] Alias, fonts, theme, global CSS, dark mode, metadata, SEO, favicon
      placeholder configured
- [x] Six global providers built and wired into the root layout (Theme,
      Animation, Lenis, Cursor, Sound, Experience) — no real pages yet
- [x] `pnpm build` / `lint` / `typecheck` pass; dev server verified in-browser

## Phase 1 — Story & Scene Definition (current)

- [ ] Story architecture defined with Product Architect
      ([07-story-architecture.md](./07-story-architecture.md))
- [ ] Scene map drafted ([08-scene-map.md](./08-scene-map.md))
- [ ] Motion language voice decided
      ([05-motion-language.md](./05-motion-language.md))
- [ ] Typography decided

## Phase 1.5 — Backend Architecture & Creator Studio

Design complete, pending approval; nothing implemented yet.

- [x] Two-product architecture designed (Studio writes, Experience reads,
      service-layer boundary) — [13-backend-architecture.md](./13-backend-architecture.md)
- [x] App topology decided: single Next.js app, route groups (not a monorepo, yet)
- [x] Auth model decided: Better Auth, single-user for now
- [x] Database schema designed — [14-database-schema.md](./14-database-schema.md),
      draft at [`prisma/schema.prisma`](../prisma/schema.prisma)
- [x] API design decided: typed Route Handlers, not raw Server Actions on
      Prisma — [15-api-design.md](./15-api-design.md)
- [x] Studio modules mapped to schema/API — [16-studio-modules.md](./16-studio-modules.md)
- [ ] **Design approved by Product Architect** ← blocking implementation
- [ ] Prisma + Postgres installed, first migration run
- [ ] Better Auth installed and wired to the `(studio)` route group
- [ ] Service layer (`src/services/`) implemented per [16](./16-studio-modules.md)
- [ ] Zod schemas (`src/validation/`) implemented
- [ ] Storage adapter (`src/storage/`) implemented (local)
- [ ] Content block registry (`src/blocks/`) implemented with the initial
      block set

## Phase 2 — Core Systems

- [x] Motion system (`systems/motion/`) built
- [x] Scroll system wired (Lenis + GSAP ScrollTrigger integration)
- [x] Interaction system (`systems/interaction/`) built
- [x] Design tokens implemented (CSS-first) — [11-design-tokens.md](./11-design-tokens.md)
- [ ] Base component library started
      ([09-component-system.md](./09-component-system.md))
- [ ] Interaction library seeded with first entries
      ([06-interaction-library.md](./06-interaction-library.md))

## Phase 3 — First Scenes

- [x] First real scene built: the Door (`src/features/door/`) — the
      landing entry point, replacing the `create-next-app` boilerplate on
      `/`. First feature to actually exercise the motion/theme systems
      with real (if placeholder-copy) content and a real accent color.
- [x] Experience Shell built (`src/experience/`, `src/systems/experience/`)
      — scene orchestration, transitions, progress, overlay layer,
      dev-only debug HUD. Generic infrastructure, no scene content, not
      yet mounted anywhere — see
      [03-folder-architecture.md](./03-folder-architecture.md#the-experience-shell).
      How the Door and the Shell relate is an open decision.
- [ ] Case study / project pages — blocked on story architecture
- [ ] Accessibility pass (keyboard, screen reader, reduced motion, contrast)
- [ ] Performance pass (Lighthouse baseline)

## Phase 4 — Studio UI & Experience Wiring

Supersedes the earlier "Content & CMS / Sanity" plan — replaced by the
custom Studio platform designed in Phase 1.5.

- [ ] Studio UI built module-by-module, per [16-studio-modules.md](./16-studio-modules.md)
      (Dashboard → Projects → Case Study Builder → Career Timeline → Blogs →
      Playground → Media Library → Global Settings → Experience Settings)
- [ ] Experience wired to read real content via the service layer
      (no hardcoded content remaining)
- [ ] MDX retained only for non-database content (e.g. legal pages), if any

## Phase 5 — Polish & Launch

- [ ] Full accessibility audit
- [ ] Full performance audit
- [ ] Deploy to Vercel
