# 18 — Product Definition (Sprint 2)

> **Method note:** every section below is synthesized strictly from what's
> already documented in this repository (docs/00–17, `CLAUDE.md`,
> `CONTEXT.md`) — nothing here is invented. Where a decision genuinely
> hasn't been made anywhere in the repo, that's stated explicitly as a
> **placeholder**, with a note on where the answer needs to come from
> (almost always: the Product Architect). See the
> [Product Readiness Report](#product-readiness-report) at the end for what
> those gaps mean for Sprint 3.

## 1. Product Vision

> Source: [00-project-vision.md](./00-project-vision.md)

**Blank to Bold** is not a typical portfolio. It's an award-level
interactive digital experience that presents Rehan's journey as a Product
Designer through interaction, motion, exploration, and thoughtful
storytelling. It is treated as a digital product, not a personal website.

The feeling being built toward:

- Visitors should not feel like they are browsing a portfolio.
- Visitors should feel like they are exploring an interactive story.
- Every section should encourage curiosity.
- Every interaction should have a purpose.
- Every animation should support storytelling.
- The experience should be memorable without becoming confusing.

## 2. Product Mission

> Synthesized from [13-backend-architecture.md](./13-backend-architecture.md)
> and [00-project-vision.md](./00-project-vision.md) — no document states a
> "mission" verbatim, so this is a direct combination of the two documented
> halves of the product, not a new claim.

Two connected products working together:

- **Blank to Bold Experience** — the public site. Renders content. Never
  hardcodes it.
- **Blank to Bold Studio** — the private creator platform. Creates, edits,
  and manages every piece of content, without touching code.

The mission is to give the creator (Rehan) a self-sufficient way to author
and evolve his own story — through Studio — and to turn that content into a
public experience that tells that story through interaction and motion
rather than a static page — through Experience.

## 3. Product Principles

> Source: [01-design-principles.md](./01-design-principles.md) (full list,
> unabridged) + [12-engineering-rules.md](./12-engineering-rules.md) Rule
> #001 (the one principle formalized at the engineering level).

1. Experience before interface.
2. Story before decoration.
3. Motion with purpose.
4. Simplicity over complexity.
5. Performance over flashy effects.
6. Accessibility is mandatory.
7. Desktop-first, but fully responsive.
8. Every interaction should feel intentional.
9. Never copy another portfolio.
10. Build original systems.

Interaction philosophy: every interaction must answer **"Why does this
exist?"** — if there's no meaningful answer, remove it.

Engineering-level extension of the same discipline: **one source of truth**
(Rule #001) — applied first to design tokens (CSS only, never duplicated in
TypeScript), and by design intent to product data too (the service layer,
once built, is meant to be the single place content is read from — see
§11).

## 4. Product Goals

> Source: [00-project-vision.md](./00-project-vision.md) "Guiding
> constraint" + [10-roadmap.md](./10-roadmap.md).

Documented goals:

- Engineer the project "with the same care as a high-quality SaaS product,"
  expected to evolve over time — not a one-off static site.
- Think in systems, not pages; don't rush into building pages before the
  technical foundation is solid.
- Ship a public Experience that never hardcodes content, backed by a Studio
  that lets the creator manage everything without touching code.

**Placeholder — not documented anywhere in the repo:** the underlying
_business_ or _career_ goal this product serves (e.g. attracting job
opportunities, freelance clients, speaking engagements, or simply a
personal creative record) has never been stated. Every technical decision
so far has been made without knowing this, because it hasn't blocked
infrastructure work — but it will shape almost every choice in Sprint 3
(what "success" looks like, what the homepage should optimize for, what a
visitor should do after arriving). **Needs Product Architect input.**

## 5. Target Audience

> **Placeholder — not documented anywhere in the repo.**

No document defines who visits Blank to Bold Experience or why. Candidate
audiences implied loosely by the "Product Designer portfolio" framing
(hiring managers, design leads, recruiters, peers, potential clients) are
not confirmed anywhere — naming them here would be inventing information,
which this document is explicitly not allowed to do. **Needs Product
Architect input before Sprint 3** — this gap blocks §6 and §7 directly, and
indirectly shapes §9–§11.

## 6. User Personas

> **Placeholder — not documented anywhere in the repo.**

No personas exist in any doc. This is downstream of §5 (Target Audience)
being undefined — personas can't be responsibly drafted without first
knowing who the audience actually is. **Needs Product Architect input.**

## 7. User Problems

> **Placeholder — not documented anywhere in the repo.**

No document states what problem a visitor has that this experience solves
(e.g. "recruiters can't tell if a candidate can actually think through a
design problem, only look at pretty screens"). The Design Principles
(§3) describe _how_ the experience should feel, but not _why_ a visitor
needs it. **Needs Product Architect input** — likely resolved together with
§5–§6 as one piece of work (audience → their problem → persona), not three
separate exercises.

## 8. Value Proposition

> Partially documented; partially placeholder.

**What's documented:** the differentiation is explicit —
[01-design-principles.md](./01-design-principles.md) principle 9 ("Never
copy another portfolio") and the Vision's framing ("not browsing a
portfolio," "exploring an interactive story") establish _how_ this product
is meant to differ from a typical designer portfolio: original, story-driven
systems instead of a template with a project grid.

**Placeholder:** _why that differentiation matters to the visitor_ — the
actual value exchanged — isn't stated, because it depends on §5–§7 being
answered first. A value proposition needs an audience and a problem to be
a proposition _to_; right now this section can only describe the product's
stylistic differentiation, not its value.

## 9. Product Pillars

> Synthesized from [13-backend-architecture.md](./13-backend-architecture.md)
> (the two-product split) and [01-design-principles.md](./01-design-principles.md)
> (the design principles) — no document uses the word "pillars," this
> groups already-documented commitments under that heading.

1. **Two connected products, one discipline.** Experience (public, renders
   only) and Studio (private, manages everything) — see §2.
2. **Story-driven interaction**, not decorative motion — principles 1–3, 8.
3. **Never hardcoded.** Everything the Experience shows comes from the
   backend, managed through Studio — the central architectural commitment
   of [13-backend-architecture.md](./13-backend-architecture.md).
4. **Original systems over templates.** Principles 9–10 — no copied
   portfolio patterns, every interaction/motion system is purpose-built and
   named.
5. **Accessibility and performance as non-negotiable**, not later
   polish — principles 5–6, the [Performance Budget](./01-design-principles.md#performance-budget)
   and [Accessibility Requirements](./01-design-principles.md#accessibility-requirements).

## 10. Success Metrics

> Mostly a placeholder — only one metric is documented anywhere.

**Documented:** "Target an excellent Lighthouse score" —
[01-design-principles.md](./01-design-principles.md#performance-budget).
This is a technical/quality metric, not a product-outcome metric.

**Placeholder — not documented anywhere:** no product or business success
metric exists (e.g. visit-to-contact conversion, time spent per case study,
number of case studies published, recruiter/client inquiries generated,
returning visitors). This is a direct consequence of §4's business-goal gap
— metrics can't be defined before the goal they'd measure is defined.
**Needs Product Architect input.**

## 11. Functional Scope

> Source: [16-studio-modules.md](./16-studio-modules.md) (Studio) and
> [13-backend-architecture.md](./13-backend-architecture.md) /
> [14-database-schema.md](./14-database-schema.md) (Experience + data
> model). This is the most thoroughly documented section in the repo —
> designed, not yet built (see [17-engineering-review.md](./17-engineering-review.md)
> for what's built vs. designed).

**Blank to Bold Studio** (private, single-user, per
[CONTEXT.md](../CONTEXT.md)) — nine modules:

| Module              | Scope                                                                                                                                                                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard           | Overview, recent activity, drafts, published content                                                                                                                                                                                |
| Projects            | Create/edit/delete/draft/publish/archive case studies; fields: title, slug, category, cover/thumbnail/gallery, role, duration, team, company, technologies, tags, live/GitHub/Figma links, metrics, SEO, status                     |
| Case Study Builder  | Ordered, reusable content blocks per project (hero, overview, challenge, research, insights, user-flow, wireframes, design-system, final-ui, prototype, testing, reflection, results) — new block types addable without a migration |
| Career Timeline     | Company, position, dates, description, logo, achievements, skills                                                                                                                                                                   |
| Blogs               | Draft/publish, categories, tags, featured image, structured rich content (same block system as Case Study Builder), SEO                                                                                                             |
| Playground          | UI experiments, motion studies, small projects, explorations                                                                                                                                                                        |
| Media Library       | Images, video, SVG, PDF, Lottie, Rive, 3D assets — single library, referenced everywhere                                                                                                                                            |
| Global Settings     | Name, bio, social links, contact info, SEO/metadata, Open Graph images, theme settings                                                                                                                                              |
| Experience Settings | Homepage scene, hero variant, cursor style, motion intensity, theme, intro animation, featured projects, navigation behaviour — makes the Experience itself configurable, nothing hardcoded                                         |

**Blank to Bold Experience** (public) — renders whatever Studio publishes:
case studies, career timeline, blog, playground, and site-wide
identity/SEO, all read through a typed service layer, never hardcoded.

## 12. Non-functional Scope

> Source: [01-design-principles.md](./01-design-principles.md) (performance,
> accessibility, responsiveness) and [13-backend-architecture.md](./13-backend-architecture.md)
> (auth, validation).

- **Performance:** part of the design, not traded against it. Optimize
  images, fonts, JavaScript, animations, rendering. Target an excellent
  Lighthouse score.
- **Accessibility:** mandatory, not a stretch goal — keyboard navigation,
  screen reader support, `prefers-reduced-motion` respected, color
  contrast, visible focus states.
- **Responsiveness:** desktop-first, but fully responsive — every
  experience must hold up on mobile/tablet.
- **Security:** Studio guarded by Better Auth session checks on every
  route (design only, not installed — see
  [17-engineering-review.md](./17-engineering-review.md)); Experience has
  no auth surface.
- **Data integrity:** Zod validation as the single source of truth for
  both runtime input validation and TypeScript types (design only).

## 13. Out of Scope

> Source: explicit "not now" statements across docs/13–15 and
> [10-roadmap.md](./10-roadmap.md).

- **Sanity (or any third-party headless CMS)** — superseded by the custom
  Postgres/Prisma-backed Studio ([02-tech-stack.md](./02-tech-stack.md)).
- **Multi-user Studio / roles & permissions** — single-user for now, by
  explicit choice ([CONTEXT.md](../CONTEXT.md)); a `Role` model is an
  additive future change, not part of current scope.
- **Draft preview tokens** (previewing unpublished content from Studio on
  Experience URLs) — flagged as a reasonable future need, not designed.
- **Full-text search** — nothing in the current product spec needs it.
- **A monorepo split** (separate `apps/studio` + `apps/experience`) — single
  Next.js app with route groups was chosen deliberately; the service-layer
  boundary keeps a future split mechanical, but it's not current scope
  ([13-backend-architecture.md](./13-backend-architecture.md)).
- **API versioning** (`/api/v1`) — not needed with a single in-process
  consumer ([15-api-design.md](./15-api-design.md)).
- **Cloudinary/S3 storage** — designed for, not implemented; local storage
  only for now ([13-backend-architecture.md](./13-backend-architecture.md)).

## 14. Product Constraints

> Source: cross-referenced from docs/00, 01, 13, and CONTEXT.md.

- **Solo creator/operator.** Single-user Studio, no team workflow — a
  documented, deliberate choice, not an oversight.
- **Originality constraint.** Principle 9 — never copy another portfolio;
  every system is purpose-built.
- **Desktop-first design constraint**, with a hard requirement that it
  still works fully on mobile/tablet (§12).
- **Accessibility is a hard constraint**, not a trade-off surface —
  explicitly "never traded away for a visual effect."
- **Technical constraint:** Next.js App Router + Vercel deployment,
  PostgreSQL + Prisma for data, Better Auth for Studio auth — all decided
  ([02-tech-stack.md](./02-tech-stack.md)).
- **Placeholder — not documented:** timeline/deadline, budget, and whether
  there's an external stakeholder (employer, client) with a delivery date.
  Nothing in the repo states any date-driven constraint. **Needs Product
  Architect input if one exists.**

## 15. Open Product Questions

> Source: [CONTEXT.md](../CONTEXT.md) "Open decisions" (verbatim, plus this
> sprint's additions below it).

Carried over from CONTEXT.md, still unresolved:

- **Brand direction** — a `docs/01-brand.md` was proposed early on and
  never created; no color palette, voice, or brand identity exists beyond
  shadcn's neutral placeholder theme.
- **Experience direction** — a `docs/02-experience.md` was proposed
  alongside Brand and also never created.
- **Typography** — still placeholder (Geist), no font decision made.
- **Story architecture** — the narrative arc, chapters/acts, and
  emotional/tonal shifts of the experience are undefined
  ([07-story-architecture.md](./07-story-architecture.md)); this blocks the
  scene map ([08-scene-map.md](./08-scene-map.md)) and the real shape of
  `ExperienceProvider`.

New, surfaced by this document:

- Target audience (§5), personas (§6), user problems (§7) — undefined.
- The underlying business/career goal this product serves (§4) — undefined.
- Product-level success metrics (§10) — undefined.
- Timeline/deadline/external stakeholder, if any (§14) — undefined.

## 16. Risks

> Synthesized from the open questions above — these are logical
> consequences of documented gaps, not new claims about the product.

- **Building the wrong experience.** Without a defined audience (§5) or
  user problem (§7), Sprint 3 architecture/scene work risks optimizing for
  "impressive to build" rather than "effective for whoever actually visits
  this."
- **Content never gets populated.** The entire Functional Scope (§11) is
  designed around a single-operator Studio; if that operator doesn't
  actually use it to publish real content, the Experience has nothing to
  render regardless of how well-built the pipeline is. (This is a product
  risk distinct from the engineering risks already tracked in
  [17-engineering-review.md](./17-engineering-review.md).)
- **Brand/typography delay compounds.** Every visual decision in Sprint 3+
  is blocked on Brand direction (§15); the longer it stays open, the more
  placeholder decisions (current neutral-gray theme, Geist font) risk
  calcifying into de facto defaults by inertia rather than intent.
- **Story architecture is a hard dependency for Experience work.** Nothing
  in `features/` can be meaningfully built until the narrative arc exists
  ([07](./07-story-architecture.md)) — this is already the stated blocker
  for Phase 1 in [10-roadmap.md](./10-roadmap.md).
- **Solo-operator risk.** Single-user Studio, single engineer/session
  continuity — no team redundancy if either the product direction or the
  technical execution stalls.

## 17. Future Opportunities

> Source: explicitly designed-for-but-deferred capabilities across
> docs/13–15.

- **Multi-user Studio with roles** — the auth model was built to make this
  additive later, not a rewrite ([13-backend-architecture.md](./13-backend-architecture.md)).
- **Cloudinary/S3 storage** — the `StorageAdapter` interface exists
  specifically so this is a config change, not a rewrite, when local
  storage stops being enough.
- **Draft preview links** — sharing unpublished Studio content via a signed
  URL, flagged as reasonable but undesigned.
- **Monorepo split** (`apps/studio` + `apps/experience`) — the
  service-layer boundary was deliberately designed to make this mechanical
  if/when Studio needs its own release cycle or a team forms.
- **External API consumers** — the Route Handler-based API design means
  `/api/v1` versioning can be introduced later without touching the
  service layer, if a consumer beyond this app ever appears
  ([15-api-design.md](./15-api-design.md)).
- **Full-text search** — a Postgres `tsvector` column/index can be added
  later without restructuring the schema ([14-database-schema.md](./14-database-schema.md)).

---

## Product Readiness Report

### Do we know enough about the product to start architecture?

**No.**

The _technical_ architecture (systems, folder structure, database schema,
API design, service-layer boundary) is thoroughly designed and reviewed —
see [13](./13-backend-architecture.md)–[17](./17-engineering-review.md).
That work can proceed on its own merits regardless of the gaps below (it's
infrastructure, not experience). But **product architecture** — what the
Experience actually needs to be, structurally, to serve real visitors —
cannot responsibly start yet, because the questions that would shape it
are still open.

Concretely: `features/` (the Experience's story-driven units) can't be
architected without knowing the story (§15), the story can't be written
without knowing who it's for (§5) and what problem it solves for them
(§7), and none of the visual-layer decisions (§15: brand, typography) have
been made either. Any architecture built now would be structurally
plausible but built on assumptions, not decisions.

### Missing product decisions before Sprint 3

In dependency order — each blocks the ones below it:

1. **Target audience** (§5) — who is this for.
2. **User problem** (§7) — what problem does the experience solve for
   them.
3. **User personas** (§6) — concrete enough to design against; depends on
   1–2.
4. **Underlying product/business goal** (§4) — what this project is
   actually trying to achieve for its creator.
5. **Success metrics** (§10) — how "working" gets measured; depends on 4.
6. **Story architecture** (§15, [07-story-architecture.md](./07-story-architecture.md)) —
   the narrative arc; depends on 1–3 to be meaningful rather than
   arbitrary.
7. **Brand direction** (§15) — visual identity; can proceed in parallel
   with 6, doesn't strictly depend on it.
8. **Typography** (§15) — can be decided alongside brand.

**What can proceed in the meantime, without waiting on the above:** the
backend implementation validated in [17-engineering-review.md](./17-engineering-review.md)'s
recommendation (one real service + one real Route Handler, Prisma
installed, first migration run) — that work is infrastructure, is already
fully designed, and doesn't depend on any open product question. It was
explicitly out of scope for this sprint by instruction, not because it's
blocked.
