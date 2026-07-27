# 14 — Database Schema

> **Status: design draft.** The schema lives at
> [`prisma/schema.prisma`](../prisma/schema.prisma). Prisma is not installed
> and this has not been migrated against a real database. This doc explains
> the _why_ behind it; read the two side by side.

## Design principles applied

- **Avoid duplication** — `Company` and `Skill` are shared between
  `Project` and `CareerEntry` rather than re-entered per record (a
  company's logo gets uploaded once; "TypeScript" as a skill exists once).
- **Everything editable from Studio is a table, not an enum.** `Category`,
  `Tag`, `Skill`, `Company` are all rows a creator can add through Studio.
  A hardcoded Prisma enum for any of these would violate "manage every
  piece of content without touching the code."
- **Structured JSON where the data is small, embedded, and never queried
  independently** — `team`, `metrics`, `achievements`, `socialLinks`, `seo`.
  These are always fetched _with_ their parent record and never searched or
  joined on their own, so a JSON column is simpler and cheaper than a
  normalized table with no real benefit.
- **Content blocks are polymorphic and additive** — see below.
- **Settings are enforced-singleton tables** — see below.

## Content blocks: how "add a block type later" actually works

`ContentBlock` has `type: String` + `data: Json` + `order: Int`, and belongs
to _either_ a `Project` or a `BlogPost` (two nullable foreign keys, exactly
one set — enforced at the service/validation layer; a Postgres `CHECK`
constraint can be added via a raw migration later for defense in depth, but
isn't blocking).

This is what makes new block types possible without a migration: the
database doesn't know or care what `hero` or `challenge` or `user-flow`
means — that's owned entirely by the block registry in
`src/blocks/registry.ts` (Zod schema + Studio editor component + Experience
renderer component per type; see
[13-backend-architecture.md](./13-backend-architecture.md)). Adding
`"testimonial"` as a new block type is a code-only change (one registry
entry) — no `ALTER TABLE`, no change to any existing row.

**Why one shared `ContentBlock` model instead of separate
`ProjectBlock`/`BlogPostBlock` tables:** the block infrastructure (schema
validation, ordering, the Studio drag-and-reorder editor, the registry
pattern) is identical for both. Splitting it would duplicate all of that for
no isolation benefit — `Project` and `BlogPost` blocks are never queried
together, so there's no need to keep them in one table for that reason
either; it's purely to avoid re-building the same system twice.

## Settings: enforced-singleton tables

`SiteSettings` and `ExperienceSettings` each have exactly one row. Rather
than trusting application code to never insert a second row, `id Int @id
@default(1)` makes a second insert a primary-key violation — the database
itself enforces "there is only ever one settings row," not just convention.

## Media: one library, referenced everywhere

Every image/video/asset in the system — project covers, thumbnails,
gallery items, company logos, blog featured images, career entry logos,
playground covers — is a `Media` row, referenced by foreign key. Nothing
stores a raw URL string outside the `Media` table. This is what makes the
Media Library module possible at all (a single place listing every asset
and what it's used by) and is what the storage abstraction
(`StorageProvider` enum + `url`) hangs off of — swapping local storage for
Cloudinary/S3 later touches `Media.storageProvider` values and the
`StorageAdapter` implementation, nothing else.

## Auth tables

`User` / `Session` / `Account` are shaped to match what Better Auth expects
(exact fields get finalized when it's actually installed — this is the
close-enough draft). Single-user for now, per the topology decision in
[13](./13-backend-architecture.md) — no `Role` model yet. Adding one later
is additive (a nullable/defaulted column plus permission checks in Route
Handlers), not a schema rewrite.

## What's intentionally NOT in the schema yet

- **SEO as its own table** — it's a small, always-1:1, never-independently-queried
  shape, so it's a `Json` column (on `Project`, `BlogPost`, `SiteSettings`)
  validated by one shared `SeoMetadata` Zod schema, not a normalized table.
- **Draft preview tokens** — flagged as a future need in
  [13](./13-backend-architecture.md#authentication), not designed yet.
- **A `Role`/permissions model** — see auth section above.
- **Full-text search indexes** — nothing in the product spec needs search
  yet; adding a Postgres `tsvector` column/index later doesn't require
  restructuring anything above.

## Model index

| Model                                                                          | Purpose                                                   |
| ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| `User`, `Session`, `Account`                                                   | Better Auth                                               |
| `Category`, `Tag`, `Skill`, `Company`                                          | Shared, Studio-manageable vocabulary                      |
| `Media`                                                                        | Every uploaded asset, referenced everywhere               |
| `ContentBlock`                                                                 | Polymorphic case-study/blog content, additive block types |
| `Project` + `ProjectGalleryItem`/`ProjectCategory`/`ProjectTag`/`ProjectSkill` | Case studies                                              |
| `CareerEntry` + `CareerEntrySkill`                                             | Career timeline                                           |
| `BlogPost` + `BlogPostCategory`/`BlogPostTag`                                  | Blog                                                      |
| `PlaygroundItem` + `PlaygroundTag`                                             | Playground                                                |
| `SiteSettings`                                                                 | Global settings (singleton)                               |
| `ExperienceSettings` + `ExperienceFeaturedProject`                             | Experience configuration (singleton)                      |

See [16-studio-modules.md](./16-studio-modules.md) for how each Studio
module maps to these models.
