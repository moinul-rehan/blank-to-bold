# 13 — Backend Architecture (Phase 1.5)

> **Status: design only, not implemented.** Nothing in this doc, or in
> [14](./14-database-schema.md)/[15](./15-api-design.md)/[16](./16-studio-modules.md),
> has been built yet — no Prisma install, no database, no API routes, no
> Studio UI. This is the design to review before implementation starts (see
> [CONTEXT.md](../CONTEXT.md) for what's still open).

## The two products

- **Blank to Bold Experience** — the public site. Renders content. Never
  hardcodes it.
- **Blank to Bold Studio** — the private creator platform. Creates, edits,
  and manages every piece of content, without touching code.

```
Blank to Bold Studio  →  Database  →  Backend/API Layer  →  Blank to Bold Experience
        (write)                                                    (read)
```

## Core philosophy

**The frontend must not know where content comes from.** Both Studio and
Experience consume content through a **service layer** — typed functions
that encapsulate Prisma. Nothing outside `src/services/` and `src/db/`
imports Prisma or knows a Postgres database is involved. If the backend
were replaced with a headless CMS tomorrow, only the service layer would
change — every component, route, and page stays untouched.

This is the same discipline already established for design tokens
([Engineering Rule #001](./12-engineering-rules.md)): one source of truth,
consumed through a narrow, typed boundary — never duplicated or bypassed.

## App topology: one Next.js app, two route groups

**Decision:** Studio and Experience live in the same Next.js app, as
`app/(studio)/...` and `app/(experience)/...` route groups, sharing the
same `src/services/`, `src/db/`, `src/validation/`, and `src/components/`.

|                       | Single app (chosen)                               | Monorepo (two apps)                                       |
| --------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| Setup cost now        | Low — no new tooling                              | High — pnpm workspaces, Turborepo, per-package versioning |
| Deploys               | One                                               | Two, independently                                        |
| Domain/auth isolation | Same app, enforced by middleware + route grouping | Physically separate from day one                          |
| Shared code           | Direct imports, no package boundary               | Must live in `packages/*`, versioned                      |
| Right-sized for       | A solo-dev project today                          | A team, or Studio needing its own release cycle           |

**Why this is still long-term-safe, not a shortcut:** the service layer is
the real architectural boundary, not the folder structure. Because
Experience already only talks to `src/services/*` (never Prisma, never
Studio UI code), extracting Studio into its own app later is a mechanical
move — cut `app/(studio)` and `src/studio` into `apps/studio`, point it at
the same `src/services`/`src/db` (now `packages/services`/`packages/db`).
Nothing about _how_ Experience fetches data has to change. This avoids
paying monorepo complexity for scale the project doesn't have yet, per
[04-coding-standards.md](./04-coding-standards.md)'s no-over-engineering
rule — while keeping the exit door real, not theoretical.

## Layered architecture

```
Studio UI (src/studio/)          Experience UI (src/features/, app/(experience)/)
        │                                        │
        ▼                                        │
app/(studio)/api/** Route Handlers                │
   (auth check → Zod validate → call service)     │
        │                                        │
        └──────────────► src/services/ ◄──────────┘
                     (the ONLY layer that imports Prisma)
                                │
                                ▼
                          src/db/client.ts
                                │
                                ▼
                            PostgreSQL
```

- **Studio** writes through Route Handlers (`app/(studio)/api/**`), which
  authenticate, validate with Zod, and delegate to a service function.
- **Experience** reads by calling the _same_ service functions directly
  from Server Components — no HTTP round-trip to its own API, since it's
  in-process in the same server. It still goes through the identical typed
  boundary Studio does; it just doesn't need the network hop.
- **Services** (`src/services/*.service.ts`) are the only files that import
  `@prisma/client` outside of `src/db/`. A route handler or a Server
  Component that calls `prisma.project.findMany()` directly is a violation
  of this architecture, not a shortcut.

## Authentication

**Better Auth**, guarding every `app/(studio)/**` route via middleware
(session check → redirect to login if absent). **Single-user** for now (see
[CONTEXT.md](../CONTEXT.md)) — one owner account, no role/permission system.
Better Auth is still used rather than a hardcoded password check, so
upgrading to multi-user later is a data-model addition (a `Role` field), not
an auth-system replacement.

Experience has no auth. (A signed-preview-token mechanism for previewing
unpublished content from Studio is a reasonable future addition — flagged
here, not designed yet, since nothing currently needs it.)

## Validation: Zod as the single source of truth for types

Every content model gets a Zod schema in `src/validation/`. That schema is
used for:

1. Runtime validation in Route Handlers (reject bad input before it reaches
   a service).
2. The TypeScript type itself, via `z.infer<typeof schema>` — never a
   hand-written duplicate `interface`.

This is the same "one source of truth" discipline as Rule #001, applied to
data shapes instead of design tokens: the Zod schema is authoritative, types
are derived from it, not maintained in parallel.

## Storage: swappable from day one, without a rewrite

A `StorageAdapter` interface (`src/storage/`) with three methods —
`upload`, `delete`, `getUrl` — is the only thing the rest of the app talks
to. `LocalStorageAdapter` is the implementation for now; `CloudinaryAdapter`
/ `S3Adapter` implement the same interface later. Which one is active is an
environment variable, not a code change anywhere that uses storage.

## Content blocks: additive by design

The Case Study Builder and Blog rich content both need "add a new block type
later without touching existing data." The mechanism:

- A `ContentBlock` row is `{ type: string, data: Json, order: int }`.
- Each block **type** (`hero`, `challenge`, `user-flow`, …) is registered in
  `src/blocks/registry.ts` as `{ schema (Zod), StudioEditor (component),
ExperienceRenderer (component) }`.
- Adding a new block type = adding one registry entry. No migration, no
  change to any existing `ContentBlock` row, no change to `Project` or
  `BlogPost`.

See [16-studio-modules.md](./16-studio-modules.md) for the concrete block
type list, and [14-database-schema.md](./14-database-schema.md) for how
`ContentBlock` relates to `Project`/`BlogPost`.
