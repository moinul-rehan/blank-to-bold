# 17 — Engineering Review (Sprint 1.1 — Foundation Finalization)

A deeper pass on top of the Sprint 1 review: not "what exists," but "is what
exists actually sound." Findings below drove the Sprint 1.1 changes
(`.env.example`, folder removals, doc fixes) and flag what's left
unresolved on purpose.

## Current Architecture

Three layers, in place today:

1. **Systems** (`src/systems/`) — four cross-cutting concerns (motion,
   interaction, cursor, theme), each split into an **engine** (pure,
   framework-agnostic logic) and consumed by a **provider** (React wiring),
   backed by a **Zustand store** where reactive state is actually needed.
   See [03-folder-architecture.md](./03-folder-architecture.md#systems-the-engineprovider-store-split).
2. **Design tokens** — CSS custom properties in `globals.css` as the single
   source of truth ([Rule #001](./12-engineering-rules.md)); TypeScript
   reads them at runtime only where a real consumer (GSAP) needs to, never
   duplicates them.
3. **Backend** — fully designed (docs/13–16), zero code. This is a
   deliberate gap, not an oversight — implementation was explicitly out of
   scope for both Phase 1.5 and this sprint.

The app shell (`Navbar`/`Main`/`Footer`) and root layout are the only place
these layers currently get exercised together, and only structurally — no
real content flows through any of it yet.

## Strengths

- **One source of truth, enforced twice over.** Rule #001 (tokens live only
  in CSS) and the service-layer boundary (Prisma only in `src/services/`,
  designed but not yet built) are the same discipline applied to two
  different problems. Consistency of principle, not just consistency of
  file naming.
- **The engine/provider/store split is real and consistent**, not just
  aspirational — all four systems follow it identically, which makes the
  next system (whatever it is) a known shape to build, not a new decision.
- **Reduced-motion and dark-mode are handled at the system level**, not
  bolted onto individual components later — this is much cheaper to get
  right now than to retrofit.
- **Every non-trivial decision has a written rationale** (docs/00–16) — a
  new contributor (or a future session with no memory of this one) can
  reconstruct _why_, not just _what_.
- **`pnpm build`/`lint`/`typecheck` pass clean** at every checkpoint so far
  — verified again after this sprint's changes, not just asserted.

## Weaknesses

- **Nothing is committed to git.** Covered in full under Risks — this is
  the most serious weakness in the project, and it's not a code weakness at
  all.
- **Zero automated tests.** No Jest/Vitest/Playwright, not even for the
  pure engine functions (`resolveCursorVariant`, `applyTheme`,
  `scaledDuration`) that are trivially unit-testable in isolation _because_
  they're framework-agnostic. The architecture makes testing cheap; nothing
  is cashing that in yet.
- **No CI.** Combined with no tests and no commits, there's currently no
  automated checkpoint anywhere confirming the project builds before it's
  relied upon.
- **The design/implementation gap is large and one-directional.** Four docs
  (13–16) describe a backend that's never been exercised by a single line
  of code. Thorough design reduces but doesn't eliminate the risk that
  something looks right on paper and turns out awkward once real Prisma
  queries and real Route Handlers exist.

## Technical Debt

1. **Reduced-motion detection is duplicated across two providers.**
   `AnimationProvider` and `LenisProvider` each independently call
   `useReducedMotion()`, setting up their own `matchMedia` listener via
   `useSyncExternalStore`. `LenisProvider` is nested inside
   `AnimationProvider` in the provider tree
   (`src/providers/app-providers.tsx`) and could consume
   `useAnimationContext().reducedMotion` instead of re-deriving the same
   value independently. Low cost today (two cheap `matchMedia` listeners,
   not a correctness bug), but it's the kind of duplication that compounds
   if a third system also needs reduced-motion. **Not fixed in this
   sprint** — flagged per the "polish and validate, don't implement"
   scope; a real, scoped candidate for the start of Sprint 2.
2. **`ThemeScript`'s pre-hydration inline script duplicates
   `theme.engine.ts`'s dark-resolution logic** as a standalone string.
   This one is unavoidable — the script runs before any module has loaded
   and can't `import` anything — and is already commented in place so it
   doesn't read as an oversight. Documented here for completeness, not
   flagged as something to fix.
3. **`src/providers/theme-provider.tsx` and `cursor-provider.tsx` both
   re-export their store's hook** (`export { useThemeStore } from ...`,
   `export { useCursorStore } from ...`). Minor, consistent, low-risk — but
   worth a rule going forward: pick one canonical import path (the store
   directly, or the provider) per system rather than two valid paths to the
   same hook, before more systems copy the pattern.

## Risks

1. **No version control history — unchanged from the Sprint 1 review, still
   unresolved.** `git log` still reports zero commits. This remains the
   single highest-severity risk in the project and sits outside this
   sprint's scope to fix (this sprint didn't run `git commit`, per "don't
   implement" — but committing isn't "implementation," it's hygiene, and
   should happen immediately after this review is read).
2. **Tailwind v4's `@theme` tree-shaking is a manual discipline, not a
   guardrail.** Already fixed once (docs/11), but nothing currently stops
   a future token addition from being placed back inside a bare `@theme`
   block and silently breaking a runtime reader again. A lint rule or
   comment-adjacent convention is the real fix; for now it's institutional
   memory only.
3. **Four "systems" folders for a genuinely small amount of code.** ~150
   lines total across motion/interaction/cursor/theme engines combined.
   Not wrong — this was explicit, direct instruction, and the shape holds
   up — but worth watching: if Sprint 2/3 doesn't add real weight to each
   system, the granularity should be reconsidered rather than defended on
   principle.
4. **Environment variable surface is now fully documented but fully
   unvalidated.** `.env.example` (this sprint) lists every variable the
   backend design implies, but nothing currently reads any of them except
   `NEXT_PUBLIC_SITE_URL`. The moment Prisma/Better Auth land, this file
   needs to be checked against what those libraries actually require —
   it's a best-effort forecast, not a verified contract.

## Future Recommendations

- Commit to git immediately, before any further work.
- Add a minimal CI check (lint + typecheck + build) on push, even before
  tests exist — cheapest possible safety net.
- Start test coverage with the pure engine functions
  (`systems/*/​*.engine.ts`) — they're already structured for it, zero
  refactor required.
- When Sprint 2 starts, resolve the `LenisProvider`/`AnimationProvider`
  reduced-motion duplication as a first, small, low-risk task — validates
  the "systems talk to each other via context, not by re-deriving state"
  principle before more systems are added.
- Validate the backend design against reality early — build exactly one
  service + one Route Handler end-to-end before replicating the pattern
  across all nine Studio modules (carried forward from the Sprint 1
  review — still the right call, still not done).

## Engineering Decisions (this sprint)

- **Removed `src/assets/` and `src/content/`.** Both were empty,
  unreferenced by any code, and speculative: `assets/` duplicated what
  `public/` already covers for a project this size; `content/` (MDX) lost
  its rationale once Postgres/Studio became the actual content source
  (docs/02 no longer even lists MDX as a stack choice — it had quietly
  drifted out of sync with docs/10's hedged "if any"). Recreating either is
  a one-command action the moment a concrete need exists — nothing was lost
  by removing them now.
- **Kept every installed dependency, including two with zero current
  imports (`lucide-react`, `@gsap/react`).** Verified via direct grep, not
  assumption. Distinguished "unused because nothing needs it yet" from
  "unnecessary": both are explicit, load-bearing stack choices
  (`lucide-react` is shadcn's configured icon library per `components.json`
  — removing it breaks the next `shadcn add` command; `@gsap/react`'s
  `useGSAP` hook is exactly what Sprint 3's first real animation will
  need), zero-cost to leave installed, and real churn to remove-then-reinstall
  for no benefit. **Correction to the Sprint 1 review:** that report
  described `class-variance-authority` as unused — false; `src/components/ui/button.tsx`
  imports and uses it (`cva`) for its variant API. It's a real, active
  dependency.
- **Fixed a `.gitignore` bug found while adding `.env.example`.** The
  existing `.env*` pattern would have silently prevented `.env.example`
  from ever being tracked by git — added `!.env.example` as a negation
  exception. Would have been an easy, invisible mistake to ship.
- **Marked the full-stack folder tree in docs/03 as target-vs-actual.**
  Previously the tree read as if `studio/`, `services/`, `db/`, etc.
  already existed. Now explicitly annotated `(planned)` — a documentation
  accuracy fix, not an architecture change.
- **Fixed two stale references to the pre-`features/` folder naming**
  (`docs/06-interaction-library.md`, `docs/08-scene-map.md` still said
  `scenes/`/`sections/` from before that rename).
- **Populated `docs/09-component-system.md`**, which claimed "none yet"
  while `Button`, `Navbar`, `Main`, `Footer`, `AppShell` already existed.

## Items Intentionally Postponed

Explicitly out of scope for this sprint, per instruction — listed here so
"postponed" and "forgotten" stay distinguishable:

- Prisma installation and first migration
- Better Auth installation and configuration
- Any Studio UI, including the first module (Dashboard)
- `app/(experience)` / `app/(studio)` route groups
- `src/services/`, `src/db/`, `src/validation/`, `src/blocks/`,
  `src/storage/` — none created yet, per design in docs/13–16
- Resolving the `LenisProvider`/`AnimationProvider` reduced-motion
  duplication (identified above, deliberately not fixed this sprint)
- Test infrastructure and CI
- Committing the project to git (hygiene, not implementation — but still
  not done as of this review; see Risks)
