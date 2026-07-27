# 16 — Studio Modules

> **Status: design draft.** No Studio UI has been built yet — this maps each
> module to the schema ([14](./14-database-schema.md)) and API
> ([15](./15-api-design.md)) it depends on, so implementation order is
> obvious once approved.

## Dashboard

|         |                                                                                                                                                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose | Landing page inside Studio: overview, recent activity, drafts, published content.                                                                                                                                       |
| Data    | Aggregate reads across `Project`, `BlogPost`, `PlaygroundItem` (counts by `status`, most recently `updatedAt`). No new model — a `DashboardService` that composes existing services rather than querying Prisma itself. |
| API     | `GET /api/dashboard/summary` — counts + recent items, one call.                                                                                                                                                         |
| Notes   | Purely a read/aggregation layer. Nothing here is authoritative data.                                                                                                                                                    |

## Projects

|                        |                                                                                                                                                                                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose                | Case studies — the core content type. Create/edit/delete, draft/publish/archive lifecycle.                                                                                                                                                                                                         |
| Data                   | `Project` (+ joins: `ProjectCategory`, `ProjectTag`, `ProjectSkill`, `ProjectGalleryItem`, `Company`, `Media` for cover/thumbnail).                                                                                                                                                                |
| API                    | `GET/POST /api/projects`, `GET/PATCH/DELETE /api/projects/[id]`. Status transitions (`draft → published → archived`) go through `PATCH` with a `status` field, validated against allowed transitions in the service — not a free-text field the client can set arbitrarily.                        |
| Fields → model mapping | Title/Slug/Category/Cover/Thumbnail/Gallery/Role/Duration/Team/Company/Technologies/Tags/Live Link/GitHub/Figma/Metrics/SEO/Status all map directly to `Project` columns or its joins — see [14](./14-database-schema.md) for exact shape. "Technologies" = `Skill` (shared with Career Timeline). |
| Notes                  | The project's rich content (case study body) is **not** a field on `Project` — it's the Case Study Builder, below.                                                                                                                                                                                 |

## Case Study Builder

|                                |                                                                                                                                                                                                                                                                                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose                        | Each project's body is an ordered list of reusable content blocks.                                                                                                                                                                                                                                                           |
| Data                           | `ContentBlock` rows scoped to a `projectId`, ordered by `order`.                                                                                                                                                                                                                                                             |
| API                            | `GET/PUT /api/projects/[id]/blocks` — the whole ordered list is read/replaced together (reordering is a single write, not N individual updates).                                                                                                                                                                             |
| Block types (initial registry) | `hero`, `overview`, `challenge`, `research`, `insights`, `user-flow`, `wireframes`, `design-system`, `final-ui`, `prototype`, `testing`, `reflection`, `results`. Each is one entry in `src/blocks/registry.ts`: a Zod schema (what `data` must look like), a Studio editor component, and an Experience renderer component. |
| Adding a new block type        | Add one registry entry. No migration, no change to `ContentBlock`, no change to any existing project's data — see [13](./13-backend-architecture.md#content-blocks-additive-by-design) and [14](./14-database-schema.md#content-blocks-how-add-a-block-type-later-actually-works).                                           |
| Notes                          | The Studio editor is generic — it renders "whichever editor the registry says goes with this block's `type`," so the builder UI itself never needs to change when a block type is added.                                                                                                                                     |

## Career Timeline

|         |                                                                                                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose | Work history: company, role, dates, achievements, skills.                                                                                                               |
| Data    | `CareerEntry` (+ `Company`, `CareerEntrySkill` → `Skill`). `order` field for manual reordering independent of date sorting.                                             |
| API     | `GET/POST /api/career-entries`, `GET/PATCH/DELETE /api/career-entries/[id]`.                                                                                            |
| Notes   | Shares `Company` and `Skill` with Projects — a company added while entering a career entry is immediately available when tagging a project's `Company`, and vice versa. |

## Blogs

|         |                                                                                                                                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose | Blog posts: draft/publish, categories, tags, featured image, rich content, SEO.                                                                                                                                                                                                                            |
| Data    | `BlogPost` (+ `BlogPostCategory`, `BlogPostTag`, `Media` for featured image) + `ContentBlock` rows scoped to `blogPostId` for the rich content (same block system as Case Study Builder — see [14](./14-database-schema.md#content-blocks-how-add-a-block-type-later-actually-works) for why it's shared). |
| API     | `GET/POST /api/blog-posts`, `GET/PATCH/DELETE /api/blog-posts/[id]`, `GET/PUT /api/blog-posts/[id]/blocks`.                                                                                                                                                                                                |
| Notes   | "Rich Content: Structured JSON Blocks, not raw HTML" applies here identically to the Case Study Builder — same `ContentBlock` model, same registry, likely a different (smaller) set of block types in practice (e.g. `text`, `image`, `quote`, `code`) registered alongside the case-study ones.          |

## Playground

|         |                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose | UI experiments, motion studies, small projects, explorations — lighter-weight than full case studies.                                                                                                                                                                                                                                                                                                                |
| Data    | `PlaygroundItem` (+ `PlaygroundTag`, `Media` for cover). `type` enum distinguishes the four categories in the brief.                                                                                                                                                                                                                                                                                                 |
| API     | `GET/POST /api/playground-items`, `GET/PATCH/DELETE /api/playground-items/[id]`.                                                                                                                                                                                                                                                                                                                                     |
| Notes   | Deliberately has no `ContentBlock`/case-study-builder relationship — playground items are meant to be quick to publish (title, description, cover, optional live embed), not a full authoring flow. If that changes later, adding blocks here is the same additive pattern (one more nullable FK on `ContentBlock`, or a lighter `body: Json` field if blocks turn out to be overkill for this module specifically). |

## Media Library

|         |                                                                                                                                                                                                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose | Single library for every asset — images, video, SVG, PDF, Lottie, Rive, 3D.                                                                                                                                                                                                                 |
| Data    | `Media` — see [14](./14-database-schema.md#media-one-library-referenced-everywhere): every other module references `Media` by foreign key rather than storing its own URL.                                                                                                                  |
| API     | `POST /api/media` (upload — goes through `StorageAdapter`), `GET /api/media` (list/search by type), `DELETE /api/media/[id]` (blocked if still referenced — checked in the service, not left to a DB foreign-key error).                                                                    |
| Notes   | Upload validation (mime type, size limits) happens in `src/storage/` before any database write. Local storage now, `StorageProvider` + `StorageAdapter` make Cloudinary/S3 a config change later — see [13](./13-backend-architecture.md#storage-swappable-from-day-one-without-a-rewrite). |

## Global Settings

|         |                                                                                                                            |
| ------- | -------------------------------------------------------------------------------------------------------------------------- |
| Purpose | Site-wide identity: name, bio, social links, contact info, SEO/metadata, Open Graph images, theme settings.                |
| Data    | `SiteSettings` — enforced-singleton table (see [14](./14-database-schema.md#settings-enforced-singleton-tables)).          |
| API     | `GET/PATCH /api/settings/site` — no create/delete/list; it's always the one row.                                           |
| Notes   | `ogImageId` references `Media`, same as every other image reference in the system — no separate upload path for OG images. |

## Experience Settings

|         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purpose | Makes the public Experience itself configurable: homepage scene, hero variant, cursor style, motion intensity, theme, intro animation, featured projects, navigation behaviour.                                                                                                                                                                                                                                                                                                                                                                                                     |
| Data    | `ExperienceSettings` (enforced-singleton, same pattern as `SiteSettings`) + `ExperienceFeaturedProject` (ordered join to `Project`).                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| API     | `GET/PATCH /api/settings/experience`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Notes   | This is what makes "nothing hardcoded" actually true end to end — the Experience's root layout/homepage reads this via `SettingsService.getExperienceSettings()` (same service-layer rule as everything else) instead of any value being a literal in Experience code. Several fields here (`motionIntensity`, `theme`, `cursorStyle`) directly parameterize the motion/interaction/theme systems already built in Phase 0/2 ([05](./05-motion-language.md), [systems/interaction](../src/systems/interaction/)) — this is the connective layer between that work and real content. |

## Cross-cutting: what's shared vs. per-module

Shared across every module above, never duplicated per module:

- Auth check (middleware on `app/(studio)/**`)
- Zod validation pattern (`src/validation/<resource>.schema.ts`)
- Service-layer boundary (`src/services/<resource>.service.ts`)
- Media referencing (always a `Media` foreign key, never a raw URL string)
- `Category`/`Tag`/`Skill`/`Company` vocabulary (shared, not re-declared per
  content type)
- `ContentBlock` + block registry (shared by Projects and Blogs)
- Status lifecycle (`ContentStatus` enum: `DRAFT`/`PUBLISHED`/`ARCHIVED`,
  shared by `Project`, `BlogPost`, `PlaygroundItem`)
