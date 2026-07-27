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
│   ├── theme/              # Theme resolution/application logic (Theme type, applyTheme, system-preference watch)
│   └── experience/         # Scene ordering/progress/transition-timing logic — see "The Experience Shell" below
├── experience/             # The Experience Shell's React layer (SceneManager, transitions, overlay, debug) — see below
├── animations/             # Reusable GSAP animation definitions/timelines, referenced by systems/features (empty so far)
├── providers/               # React context providers — see "Global vs. scoped providers" below
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
  needs reactive state at all (motion doesn't; theme/cursor/experience do).
- **Provider** (`src/providers/*-provider.tsx`) — the React wiring: calls
  the engine, reads/writes the store, subscribes to browser events, renders
  nothing itself.

A component never calls `window.matchMedia` or touches `document.*`
directly for something a system already owns — it goes through the
provider's hook (`useLenis()`, `useCursorEnabled()`, etc.) or the store.

## `providers/` — global vs. scoped

**Global** — composed once in the root layout, via `AppProviders`:

- `ThemeProvider`
- `LenisProvider`
- `AnimationProvider`
- `CursorProvider`
- `SoundProvider`

**Scoped** — `ExperienceProvider` is deliberately _not_ in `AppProviders`.
It's scene-registry-driven (it needs to know which scenes exist to
register them), so it can't be parameterless and global the way the
others are. It's owned by whatever mounts `ExperienceShell`
(`src/experience/experience-shell.tsx`), not the root layout.

See [09-component-system.md](./09-component-system.md) for how these get
documented as they're built out.

## The Experience Shell

`src/experience/` + `src/systems/experience/` together are the
content-agnostic runtime the public Experience's scenes plug into — built
before any scene content, per explicit instruction ("nothing hardcoded,"
"do not design UI, only build the framework").

**The scene data model** (`systems/experience/scene.types.ts`) — every
scene is a `SceneDefinition`: `id`, `title`, `order` (position — the
registry sorts by this, not array/declaration order), `route`,
`transition` (how it replaces the previous scene — fade/slide/scale/none),
`loadingStrategy` (`eager`/`lazy`/`preload`), `enterAnimation` /
`exitAnimation` (the scene's own internal choreography, distinct from the
transition _between_ scenes), `background` (a token reference, transparent,
or a custom component — never a hardcoded color, keeping
[Rule #001](./12-engineering-rules.md) intact), `interactionProfile`
(cursor variant / scroll lock / keyboard nav while showing), and
`component` (always a function, so lazy scenes can be code-split).

**Engine** (`systems/experience/`, pure, no React except type-only
imports for `ComponentType`):

- **`scene-registry.ts`** — `createSceneRegistry(definitions)` sorts by
  `order`, throws loudly on a duplicate id (a silently-shadowed scene is a
  worse failure than a crash), and exposes `get`/`getByRoute`/`next`/`previous`.
- **`scene-loader.ts`** — resolves a scene's `component`, caching the
  result so a scene is never fetched twice; concurrent requests for the
  same scene share one in-flight promise. `preloadScene()` is what
  `loadingStrategy: "preload"` actually means in practice — warms the
  cache without blocking anything, failures are swallowed since a failed
  preload is just a lost optimization (the real load retries later).
- **`scene-lifecycle.ts`** — `SceneLifecycleState` (`idle → loading →
entering → active → exiting`, plus `error`) and `canTransition()`, a
  guard against out-of-order state writes. Supersedes the earlier
  `TransitionPhase` — one state machine instead of two overlapping ones.
- **`scene-events.ts`** — a typed pub/sub bus (`scene:load-start`,
  `scene:enter-complete`, `scene:change`, etc.). Deliberately not React
  state: subscribers are often non-React (analytics, sound, preloading),
  and shouldn't force a re-render just to listen.
- **`scene-manager.engine.ts`** / **`progress.engine.ts`** / **`transition.engine.ts`** —
  unchanged from before: next/previous by position, 0–1 progress, and
  turning a scene's declared `transition` into concrete GSAP tween values
  (duration/ease still sourced from `motion.tokens.ts`).

**React layer** (`src/experience/`):

- **`scene-manager.tsx`** — renders the active scene. Loads it via
  `scene-loader.ts` (synchronously if already cached, so a warm scene
  never flashes a loading state), drives lifecycle transitions through the
  store, and renders the scene's declared `background` before its content.
  Has zero knowledge of what scenes exist beyond what the registry gives it.
- **`scene-transition-manager.tsx`** — runs the transition _between_
  scenes using whatever the incoming scene declared (not a hardcoded
  fade). **Known gap, documented in the file itself:** exit choreography
  isn't run yet — animating an outgoing scene requires keeping it mounted
  while the next one loads, which isn't built; `scene:exit-start`/`-complete`
  already fire so subscribers can react, the visual half is deferred until
  real scenes exist to test it against.
- **`overlay-layer.tsx`** — unchanged: an empty, non-interactive fixed
  layer above all scenes, a slot for future cross-scene UI.
- **`debug-mode.tsx`** — dev-only HUD, now shows lifecycle state,
  transition type, loading strategy, and the full registered scene list.
- **`experience-shell.tsx`** — composes all of the above:
  `<ExperienceShell scenes={[...]} initialSceneId="..." />`. Not currently
  mounted anywhere — standalone infrastructure; how it connects to an
  actual route is a separate decision.

**Provider** (`providers/experience-provider.tsx`) — builds the registry
from whatever scenes it's given, registers them into the store, and
implements what `preload` means: once the active scene reaches `active`,
if the _next_ scene's `loadingStrategy` is `preload`, fetch it ahead of
activation.

## The Global Layout

`src/experience/layout/` — nine isolated, stacked layers
(`GlobalLayout`, `src/experience/layout/global-layout.tsx`) forming the
site's fundamental visual architecture. **Genuinely isolated, not just in
name:** every primitive layer file imports nothing but `ReactNode` from
`react` — no system, no provider, no store. Each works standalone; nothing
requires the others to function.

| Layer      | File                                         | Position                            | Notes                                                                                                                                            |
| ---------- | -------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Background | `background-layer.tsx`                       | `fixed inset-0`, `z-base`           | Empty slot for a future ambient background.                                                                                                      |
| Content    | `content-layer.tsx`                          | `relative`, `z-content`             | The **only** layer in normal document flow — contributes to page height, scrolls normally.                                                       |
| Transition | `transition-layer.tsx`                       | `relative`, `z-transition`          | Wraps Content. Content-agnostic on purpose — the Scene System's `SceneTransitionManager` renders inside it and owns the actual transition logic. |
| Navigation | `navigation-layer.tsx`                       | `fixed inset-x-0 top-0`, `z-navbar` | Structural placement only (top strip), no nav content.                                                                                           |
| Overlay    | _(reused: `@/experience/overlay-layer.tsx`)_ | `fixed inset-0`, `z-overlay`        | Already existed from the Scene System build — genuinely generic already, reused rather than duplicated.                                          |
| Effect     | `effect-layer.tsx`                           | `fixed inset-0`, `z-effect`         | Empty slot for future decorative effects (grain, particles, etc.).                                                                               |
| Cursor     | `cursor-layer.tsx`                           | `fixed inset-0`, `z-cursor`         | `pointer-events-none` — never blocks clicks on real content beneath it.                                                                          |
| Sound      | `sound-layer.tsx`                            | none                                | The one layer with no viewport footprint — sound has no visual position, so none is imposed. Renders `null` if empty.                            |
| Debug      | `debug-layer.tsx`                            | `fixed inset-0`, `z-debug`          | Reserved for dev-only tooling; the Scene System's `DebugMode` renders inside it.                                                                 |

**Responsive by construction, not by extra effort:** every fixed layer
uses `inset-0`, which stretches to the viewport at any size with no
hardcoded dimensions; Content is the one layer that isn't fixed, so it
grows and scrolls the way normal page content does.

**Composition pattern, demonstrated in `experience-shell.tsx`:** generic
layer (position/z-index only) wraps real system logic (behavior/content) —
`TransitionLayer` wraps `SceneTransitionManager`, `DebugLayer` wraps
`DebugMode`. Neither generic layer needs to know the Scene System exists;
neither Scene System component needs to know which layer it's rendered
inside. This is the same "engine doesn't know about content" discipline
applied to layout instead of data.

**Open naming questions, flagged rather than silently resolved:**

- **`src/experience/layout/` vs. `src/components/layout/`** — Phase 0
  already built a traditional `AppShell`/`Navbar`/`Main`/`Footer` (normal
  document-flow header/main/footer). This Global Layout is a different
  paradigm (fixed, stacked, full-viewport layers) built for an immersive
  experience, not a traditional site. Whether these coexist for different
  purposes, or the old one gets retired in favor of this one, is
  undecided — nothing has been removed.
- **`NavigationLayer` vs. `Navbar`** — same tension, one level down: the
  old `Navbar` assumes a document-flow header that pushes content down
  (the Door's height calc already accounts for it); the new
  `NavigationLayer` assumes a fixed overlay strip. They're not
  interchangeable as-is.
- **z-index tokens added this round:** `--z-content`, `--z-transition`,
  `--z-effect`, `--z-debug` (see [11-design-tokens.md](./11-design-tokens.md)).
  `DebugMode` moved off `--z-toast` onto the new `--z-debug` — it was
  borrowing a "toast notification" token for an unrelated purpose, and now
  has its own correctly-named one.

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
