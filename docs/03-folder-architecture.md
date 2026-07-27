# 03 — Folder Architecture

Think in systems, not pages. The codebase grows around reusable systems.

As of Phase 1.5, this covers both products — see
[13-backend-architecture.md](./13-backend-architecture.md) for the
reasoning behind the Studio/Experience split and the service-layer
boundary that makes it work as one app.

**This tree shows the target architecture, not only what exists today.**
Folders marked `(planned)` don't exist on disk yet — they're designed in
docs/13–16 but intentionally not created until that work actually starts
(see [17-engineering-review.md](./17-engineering-review.md)). Everything
else is real, on disk, right now.

```
src/
├── app/
│   ├── (experience)/    # (planned) Public site routes — thin, composition-first
│   └── (studio)/        # (planned) Private creator platform routes
│       └── api/         # (planned) Studio's typed REST API (Route Handlers) — see docs/15
├── components/          # Generic, reusable UI building blocks (not tied to a story beat)
│   └── ui/               # shadcn/ui primitives (restyled/composed, never used as final components as-is)
├── features/             # Experience: story-driven units that compose components + systems (empty so far)
├── studio/               # (planned) Studio-only UI: one folder per module (see docs/16)
│   └── modules/
│       ├── dashboard/
│       ├── projects/
│       ├── case-study-builder/
│       ├── career-timeline/
│       ├── blogs/
│       ├── playground/
│       ├── media-library/
│       ├── global-settings/
│       └── experience-settings/
├── services/              # (planned) Domain services — the ONLY layer that imports Prisma outside src/db/
├── db/                    # (planned) Prisma client singleton
├── validation/            # (planned) Zod schemas — single source of truth for both runtime validation and TS types
├── blocks/                # (planned) Content block registry (type → {schema, StudioEditor, ExperienceRenderer})
├── storage/               # (planned) StorageAdapter interface + Local/Cloudinary/S3 implementations
├── systems/               # Cross-cutting infrastructure — one folder per system, framework-agnostic logic
│   ├── motion/             # GSAP config/defaults, duration+ease tokens (reads CSS vars), pure motion utils
│   ├── interaction/        # Pointer-type (fine/coarse) detection
│   ├── cursor/             # Cursor variant resolution (`data-cursor` attribute → variant)
│   └── theme/              # Theme resolution/application logic (Theme type, applyTheme, system-preference watch)
├── animations/             # Reusable GSAP animation definitions/timelines, referenced by systems/features (empty so far)
├── providers/               # Global React context providers (theme, Lenis, animation, cursor, sound, experience)
├── hooks/                  # Reusable React hooks
├── stores/                 # Zustand stores (client-side UI state — not a substitute for the database)
├── lib/                    # External integrations, SDK wrappers, shadcn's cn() helper
├── utils/                  # Pure helper functions (empty so far)
└── types/                   # Shared TypeScript types not already derived from a Zod schema (empty so far)
prisma/
├── schema.prisma            # Database schema draft — see docs/14 (not migrated)
└── migrations/              # (planned)
public/                      # Truly public static assets (favicons, robots.txt, og images)
docs/                        # Project knowledge base (this folder) — lives at project root, not under src/
```

**Removed during the Sprint 1.1 review:** `src/content/` (MDX) and
`src/assets/` (source-bundled static assets). Both were speculative —
nothing in the codebase used them, MDX's role shrank to "maybe, for legal
pages" once Studio/Postgres became the actual content source (see
[02-tech-stack.md](./02-tech-stack.md)), and `public/` already covers
static assets for a project this size. Recreating either is a one-command,
zero-risk action the moment there's a concrete need — see
[17-engineering-review.md](./17-engineering-review.md).

## Rules

- No huge files. If a file is trying to do too much, split it.
- Composition over duplication.
- Every animation belongs to the animation/motion system — it's reusable, not
  copy-pasted into the component that happens to need it first.
- Every component is designed to be reusable, even if only used once today.
- `app/` stays thin — routes assemble `features/`/`studio/`, they don't
  contain business or animation logic directly.
- **Prisma is only ever imported from `src/services/` and `src/db/`.** Not
  from a route handler, not from a Server Component, not from `studio/` or
  `features/` — see [13-backend-architecture.md](./13-backend-architecture.md).

## Distinguishing `components/` vs `features/` vs `studio/`

- **`components/`** — dumb, generic, no story context, no data-fetching
  (e.g. `Button`, `Card`, `Cursor`).
- **`features/`** — Experience-side: a story-driven unit tied to a specific
  part of the public experience, built from `components/` + `systems/` +
  `animations/` (e.g. an intro sequence, a case-study walkthrough).
- **`studio/`** — Studio-side: the private creator platform's UI (tables,
  forms, the case study block editor, the media picker). Never imported by
  `features/` or `app/(experience)`.

## Systems: the engine/provider/store split

Every system in `src/systems/` follows the same three-layer pattern,
consistently:

- **Engine** (`*.engine.ts`, in the system folder) — pure, framework-agnostic
  logic. No React, no Zustand. Testable in isolation.
- **Store** (`src/stores/*-store.ts`) — Zustand state, where the system
  needs reactive state at all (motion doesn't; theme/cursor do).
- **Provider** (`src/providers/*-provider.tsx`) — the React wiring: calls
  the engine, reads/writes the store, subscribes to browser events, renders
  nothing itself.

A component never calls `window.matchMedia` or touches `document.*`
directly for something a system already owns — it goes through the
provider's hook (`useLenis()`, `useCursorEnabled()`, etc.) or the store.

## `providers/`

Global providers composed once in the root layout:

- `ThemeProvider`
- `LenisProvider`
- `AnimationProvider`
- `CursorProvider`
- `SoundProvider`
- `ExperienceProvider`

See [09-component-system.md](./09-component-system.md) for how these get
documented as they're built out.

## Backend layers (planned — not yet created)

- **`services/`** — one file per domain (`project.service.ts`,
  `media.service.ts`, etc.). Called by both Studio's Route Handlers and
  Experience's Server Components. The only place Prisma gets imported.
- **`db/`** — the Prisma client singleton, nothing else.
- **`validation/`** — Zod schemas per resource; TS types are `z.infer`'d
  from these, never hand-duplicated (same discipline as
  [Engineering Rule #001](./12-engineering-rules.md), applied to data shapes
  instead of design tokens).
- **`blocks/`** — the content block type registry powering the Case Study
  Builder and Blog rich content — see
  [16-studio-modules.md](./16-studio-modules.md).
- **`storage/`** — the `StorageAdapter` interface; swapping local for
  Cloudinary/S3 later is a config change here, not a rewrite elsewhere.

Full rationale for all of the above: [13-backend-architecture.md](./13-backend-architecture.md).
