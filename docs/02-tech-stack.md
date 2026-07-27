# 02 — Tech Stack

| Concern          | Choice                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| Framework        | Next.js (App Router)                                                                               |
| Language         | TypeScript (strict)                                                                                |
| Styling          | Tailwind CSS                                                                                       |
| UI foundation    | shadcn/ui — primitives only, never shipped as final components                                     |
| Animation        | GSAP                                                                                               |
| Smooth scrolling | Lenis                                                                                              |
| State management | Zustand (client-side UI state — not a substitute for the database)                                 |
| Database         | PostgreSQL                                                                                         |
| ORM              | Prisma                                                                                             |
| Auth             | Better Auth (Studio only, single-user)                                                             |
| Validation       | Zod (also the source of truth for TS types — see [12](./12-engineering-rules.md)-style discipline) |
| File storage     | Local (dev) — abstracted so Cloudinary/S3 are a config change, not a rewrite                       |
| Rich content     | Structured JSON content blocks, not raw HTML                                                       |
| Icons            | Lucide                                                                                             |
| Deployment       | Vercel                                                                                             |

**Superseded:** the original CMS plan was Sanity ("later"). As of Phase 1.5
this is replaced by a custom-built creator platform — **Blank to Bold
Studio** — backed by Postgres/Prisma, not a third-party headless CMS. See
[13-backend-architecture.md](./13-backend-architecture.md) for why (full
control over the Case Study Builder's block system, no vendor schema
constraints, and the Experience already needs a typed service layer
regardless of what's behind it).

## Open stack decisions

- **Typography** — no font decisions received yet from the Product Architect
  side. Placeholder fonts until specified.

## Notes on usage

- shadcn/ui components are a starting primitive layer (accessible, unstyled
  behavior) — they get restyled/composed into the project's own design
  language, never used as final visual components as-is.
- GSAP + Lenis are wired through a dedicated system (see
  [03-folder-architecture.md](./03-folder-architecture.md) `systems/`), not
  imported ad hoc per component.
- Prisma is only ever imported from `src/services/` and `src/db/` — see
  [13-backend-architecture.md](./13-backend-architecture.md). Nothing in
  Experience or Studio UI code imports `@prisma/client` directly.
