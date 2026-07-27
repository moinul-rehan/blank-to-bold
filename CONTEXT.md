# Project Context — Blank to Bold

Living status doc. Update as decisions get made — this is not a spec, it's
"where things stand right now." See [CLAUDE.md](./CLAUDE.md) for the entry
point and [docs/](./docs) for the durable project knowledge base (vision,
principles, stack, architecture, standards, motion, story, roadmap, etc.).

## Status

**Phase:** Phase 0 complete, first slice of Phase 2 built ahead of schedule
(app shell, four frontend systems — motion/interaction/cursor/theme,
design tokens). Phase 1.5 (Backend Architecture & Creator Studio) **design
is done, pending approval** — no backend code written yet. Sprint 1.1
(Foundation Finalization) complete: `.env.example` added, two speculative
empty folders removed (`assets/`, `content/`), doc contradictions fixed,
`docs/17-engineering-review.md` added. Sprint 2 (Product Definition)
complete: `docs/18-product-definition.md` added — **verdict: not enough is
known about the product to start Sprint 3 architecture** (no target
audience, personas, user problems, business goal, or success metrics
documented anywhere; see docs/18's Product Readiness Report for the full
list, in dependency order). `PROJECT_UNDERSTANDING.md` and
`PRODUCT_BLUEPRINT.md` added (root-level synthesis docs, Confirmed vs.
Pending clearly separated). **Resolved:** the project is now committed to
git and pushed to GitHub — public repo at
[github.com/moinul-rehan/blank-to-bold](https://github.com/moinul-rehan/blank-to-bold),
`main` branch, one commit so far. This was the top risk flagged in
docs/17; it no longer applies.
Build/lint/typecheck/dev server all verified working as of 2026-07-27.

## Decisions made

- **2026-07-27 — Working relationship changed.** ChatGPT is no longer part
  of this project. Rehan now works with Claude Code alone, which covers
  both Product Architect/UX Strategist/Experience Director *and* Lead
  Frontend Engineer/Technical Architect — see [CLAUDE.md](./CLAUDE.md)'s
  Roles section. Product decisions (audience, story, brand, etc.) now get
  made through direct conversation with Rehan and written into `docs/`,
  same as engineering decisions always have been — not invented
  unilaterally. Historical docs that reference "the Product Architect"
  describe the prior arrangement, not a currently active third party.
- Stack confirmed: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
  (primitives only) + GSAP + Lenis + Zustand + MDX + Sanity (later) + Lucide +
  Vercel.
- Folder structure confirmed: `app/ components/ scenes/ sections/ systems/
animations/ hooks/ stores/ lib/ utils/ content/ assets/ public/`.
- Working relationship: ChatGPT = Product Architect/UX Strategist/Experience
  Director (source of truth for experience/interaction/product decisions).
  Claude Code = Lead Frontend Engineer/Technical Architect (implementation).
- Package manager: **pnpm**.
- Motion helper packages: GSAP + `@gsap/react` only (no Framer Motion/Motion
  for now).
- `docs/03-folder-architecture.md` folder list replaced with the
  `features/`-based architecture (no `scenes/`/`sections/` split); project
  uses a standard Next.js `src/` layout, `public/` and `docs/` at project
  root.
- Scaffolded: Next.js (App Router, TS, Tailwind v4, ESLint) + Prettier +
  shadcn/ui (style `base-nova`) + GSAP/@gsap/react + Lenis + Zustand +
  lucide-react + clsx/cva/tailwind-merge.
- Folder structure created under `src/`: `app, components, features,
systems, animations, providers, hooks, stores, lib, utils, types, content,
assets`; `public/` and `docs/` at root.
- Six global providers built and composed in `src/providers/app-providers.tsx`,
  wired into the root layout: `ThemeProvider` (class-based dark mode, no
  FOUC via inline script), `AnimationProvider` (registers GSAP ScrollTrigger,
  exposes reduced-motion), `LenisProvider` (smooth scroll, disabled under
  reduced motion, driven by the GSAP ticker), `CursorProvider` (fine-pointer
  detection, cursor variant store), `SoundProvider` (muted-by-default sound
  store, persisted), `ExperienceProvider` (placeholder `hasEntered` state —
  real shape awaits story architecture).
- `pnpm build`, `pnpm lint`, `pnpm typecheck` all pass; `pnpm dev` verified
  in-browser with no console/network errors.
- App shell built: `Navbar`/`Main`/`Footer` (structure only, no design) in
  `src/components/layout/`, composed by `AppShell`, wired into root layout
  with a skip-to-content link.
- Motion system built (`src/systems/motion/`): `motion.config.ts` (GSAP
  plugin registration + defaults, called once from `AnimationProvider`),
  `motion.tokens.ts` (reads duration from CSS custom properties for GSAP;
  since GSAP can't consume CSS easing, maps ease token names to GSAP power
  eases instead of parsing the CSS value), `motion.utils.ts`
  (`scaledDuration`, `clamp`).
- Interaction system built (`src/systems/interaction/`): `interaction.types.ts`
  (`PointerType`, `CursorVariant` — `CursorVariant` is the canonical source,
  re-exported by `stores/cursor-store.ts`), `interaction.engine.ts`
  (pointer-type detection, consumed by `CursorProvider`), `cursor.engine.ts`
  (`data-cursor` attribute → variant resolution; `CursorProvider` now
  listens for `pointerover` and updates the cursor store — no visual cursor
  component exists yet, but the state is ready for one).
- Design tokens decided as **CSS-first**: all tokens live as CSS custom
  properties in `globals.css` (see
  [docs/11-design-tokens.md](./docs/11-design-tokens.md)), no parallel TS
  token config. Added: motion duration/easing, layout rhythm
  (gutter/max-width/header-height), semantic opacity, z-index scale,
  elevation (light/dark shadow scale). Colors/radius/spacing/blur/font-weight
  intentionally NOT redefined — already tokenized by shadcn/Tailwind
  defaults.
- **Important gotcha found and fixed**: Tailwind v4 tree-shakes `@theme`
  variables not referenced by an actual utility class — several tokens
  (`--duration-base`, `--z-navbar`, etc.) were silently missing from
  compiled CSS. Fixed by moving always-needed tokens to plain `:root`
  (never pruned) and mirroring the utility-facing copies into `@theme
inline` under different names to avoid a self-reference cycle. Documented
  in docs/11 so it doesn't get reintroduced.
- **Phase 1.5 — Backend architecture designed** (not implemented). The
  project is now understood to be two connected products: **Blank to Bold
  Experience** (public, renders content only, never hardcoded) and **Blank
  to Bold Studio** (private creator platform, manages all content). Full
  design in [docs/13](./docs/13-backend-architecture.md)–[16](./docs/16-studio-modules.md):
  - App topology: **single Next.js app**, `(experience)`/`(studio)` route
    groups — not a monorepo (confirmed via user choice; documented
    trade-offs and the extraction path if it's ever needed later).
  - Auth: **Better Auth, single-user** — no roles/permissions system yet
    (confirmed via user choice).
  - Stack addition: **PostgreSQL + Prisma + Zod + Better Auth**. This
    **supersedes the earlier "Sanity later" CMS plan** —
    `docs/02-tech-stack.md` updated accordingly.
  - Core discipline: a **service layer** (`src/services/`) is the only code
    that imports Prisma; both Studio (via Route Handlers) and Experience
    (direct calls, same process) go through it. Same "one source of truth"
    principle as [Engineering Rule #001](./docs/12-engineering-rules.md),
    applied to data instead of design tokens.
  - Database schema drafted at [`prisma/schema.prisma`](./prisma/schema.prisma)
    (not migrated) — covers Projects, the polymorphic `ContentBlock` system
    (additive block types, shared by Case Study Builder + Blog rich
    content), Career Timeline, Blogs, Playground, Media Library, and
    enforced-singleton Global/Experience Settings tables.
  - API layer: typed Route Handlers (not raw Server Actions on Prisma),
    consistent error shape, auth middleware on all `(studio)` routes.
  - All 9 Studio modules mapped to schema + API in
    [docs/16](./docs/16-studio-modules.md).

## Open decisions

- **Brand and Experience docs** — earlier discussion proposed inserting
  `docs/01-brand.md` and `docs/02-experience.md` (with the rest renumbered)
  to close the gap between Vision and Architecture, but this wasn't
  confirmed or created — the session moved straight into the technical
  scaffold instead. Still pending: get Brand/Experience direction from the
  Product Architect, then create those docs and renumber.
- **Typography** — still placeholder (Geist). No font decision yet.
- **Story architecture** — not yet defined; blocks scene map and the real
  shape of `ExperienceProvider`.
- **Phase 1.5 backend design needs explicit approval before implementation
  starts** — this was an explicit instruction from the user (design first,
  build only after sign-off). Nothing in Phase 1.5's "not implemented yet"
  list (see roadmap) should be started until that approval happens.
- **Product-level gaps, surfaced by [docs/18-product-definition.md](./docs/18-product-definition.md)'s
  Product Readiness Report — blocking before Sprint 3, in dependency
  order:** target audience → user problem → user personas → underlying
  product/business goal → success metrics → story architecture (also
  listed above) → brand direction (also listed above) → typography (also
  listed above). None of these are documented anywhere in the repo. See
  docs/18 for the full reasoning on why each blocks the next.

## Next steps

See [docs/10-roadmap.md](./docs/10-roadmap.md). Two parallel tracks are
open: Phase 1 (Story & Scene Definition — needs Brand/Experience/Story
direction from the Product Architect) and Phase 1.5 implementation (needs
explicit approval of the backend architecture design in docs/13–16 before
any Prisma/Studio code gets written).

## Session log

- **2026-07-27** — Project initialized. Vision, principles, stack, and
  architecture direction received from user (relaying Product Architect
  decisions). Created `CLAUDE.md` and this file. Restructured project
  knowledge into `docs/00`–`10`. Clarified package manager (pnpm), motion
  helper packages (GSAP + @gsap/react only), and folder architecture
  (`features/` replaces `scenes/`/`sections/`) via user confirmation.
  Scaffolded the full Next.js app, installed all listed dependencies,
  initialized shadcn/ui, configured alias/fonts/theme/dark
  mode/metadata/SEO/favicon, built and wired all six global providers, and
  verified build/lint/typecheck/dev server all pass cleanly. Phase 0 done.
- **2026-07-27 (cont.)** — Built the app shell (Navbar/Main/Footer,
  structure-only), motion system, and interaction system per user spec.
  Clarified token architecture (CSS-first vs TS-first) via user
  confirmation — chose CSS-first. Implemented the full design token catalog
  in `globals.css`, documented in new `docs/11-design-tokens.md`. Found and
  fixed a Tailwind v4 tree-shaking bug that was silently dropping unused
  `@theme` tokens needed at runtime. Re-verified build/lint/typecheck/dev
  server end-to-end after the fix, including runtime CSS variable values
  checked live in-browser.
- **2026-07-27 (cont.)** — User introduced Phase 1.5: the project is a
  two-product platform (Experience + Studio), not just a public site.
  Clarified app topology (single app, route groups) and auth model
  (single-user) via user confirmation before drafting. Wrote the full
  backend architecture design — `docs/13`–`16` plus a draft
  `prisma/schema.prisma` — covering the service-layer boundary, database
  schema, API design, and a module-by-module Studio breakdown. Updated
  `docs/02-tech-stack.md` (Sanity plan superseded by Postgres/Prisma/Better
  Auth/Zod) and `docs/03-folder-architecture.md` (added `studio/`,
  `services/`, `db/`, `validation/`, `blocks/`, `storage/`, `app/`
  route groups) and `docs/10-roadmap.md` (new Phase 1.5, Phase 4 rewritten
  from "Content & CMS" to "Studio UI & Experience Wiring"). No
  implementation started — per explicit instruction, this is a design
  deliverable awaiting approval.
- **2026-07-27 (cont.)** — User re-issued a "Phase 1 engineering foundation"
  checklist. Audited it against what already existed: items 1–7, 9–10 were
  already done from earlier this session. The one real gap was item 8 (four
  separate system modules: Motion, Interaction, Cursor, Theme) — Cursor had
  been folded into Interaction and there was no dedicated Theme system.
  Split `cursor.engine.ts`/`CursorVariant` out into `src/systems/cursor/`,
  and extracted theme-resolution logic (`applyTheme`, system-preference
  watching) out of `theme-provider.tsx` into a new `src/systems/theme/`
  (engine + `Theme` type), matching the engine/provider/store pattern
  motion and interaction already used — now documented as a named pattern
  in `docs/03-folder-architecture.md`. `ThemeScript`'s pre-hydration inline
  script necessarily still restates the logic as a standalone string (it
  runs before any module loads) — noted in a comment so it doesn't look
  like an oversight. Re-verified lint/typecheck/build/dev-server clean
  after the refactor.
- **2026-07-27 (cont.)** — Sprint 1 architecture review delivered (chat
  report, not a file) — inspected the whole repo end to end. Then Sprint
  1.1 (Foundation Finalization): added `.env.example` (every future env var,
  documented) and fixed a `.gitignore` bug that would have silently
  prevented it from ever being committed; removed `src/assets/` and
  `src/content/` (empty, unreferenced, speculative — see docs/17); reviewed
  every dependency (kept all — corrected an earlier report error that
  called `class-variance-authority` unused; it's used by
  `components/ui/button.tsx`); fixed stale `scenes/`/`sections/` references
  in docs/06 and docs/08 (pre-`features/`-rename leftovers), and populated
  docs/09 which claimed no components existed; wrote
  `docs/17-engineering-review.md` (strengths/weaknesses/technical
  debt/risks/decisions/postponed items — including one real, not-yet-fixed
  finding: `AnimationProvider` and `LenisProvider` independently duplicate
  reduced-motion detection instead of `LenisProvider` reading it from
  `AnimationProvider`'s context). Re-verified lint/typecheck/build/dev
  server clean. **Top open risk, called out explicitly and not resolved
  this sprint: nothing in the project is committed to git yet.**
- **2026-07-27 (cont.)** — Sprint 2 (Product Definition, documentation
  only — no app code, folders, or packages touched). Wrote
  `docs/18-product-definition.md`: 17 required sections, synthesized
  strictly from docs/00–17 (each section cites its source), with explicit
  placeholders — not invented content — anywhere the repo genuinely has no
  answer (target audience, personas, user problems, underlying
  business/career goal, success metrics). Closed with a Product Readiness
  Report: verdict is **not enough is known to start Sprint 3 architecture**,
  with the missing decisions listed in dependency order (audience →
  problem → personas → goal → metrics → story → brand → typography).
  Explicitly noted that the backend validation slice recommended in
  docs/17 is *not* blocked by any of this — it's infrastructure, already
  designed, and was only out of scope this sprint by instruction.
- **2026-07-27 (cont.)** — Wrote `PROJECT_UNDERSTANDING.md` and
  `PRODUCT_BLUEPRINT.md` at repo root (a broad instruction requested many
  more product-thinking docs — personas, story architecture, brand,
  master blueprint — but those require an actual audience/goal/story that
  don't exist yet; writing them now would mean inventing content, which
  was explicitly disallowed, so only the two docs answerable from verified
  information were created). Then: installed GitHub CLI (`winget install
  GitHub.cli`), authenticated via device flow, created the initial git
  commit (everything from Phase 0 through this point — first commit ever
  in this repo), created a **public** GitHub repo
  ([github.com/moinul-rehan/blank-to-bold](https://github.com/moinul-rehan/blank-to-bold)),
  and pushed `main`. Resolves the top risk from docs/17.
