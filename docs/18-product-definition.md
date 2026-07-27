# 18 — Product Definition (Sprint 2)

> **Method note:** every section below is sourced either from what was
> already documented in this repository (docs/00–17, `CLAUDE.md`,
> `CONTEXT.md`) or from Rehan's direct answers in conversation (marked
> "confirmed 2026-07-27") — nothing here is invented. Where a decision
> genuinely hasn't been made by either source, that's stated explicitly as
> a **placeholder**. See the
> [Product Readiness Report](#product-readiness-report) at the end for
> what's resolved and what's still open.

## 1. Product Vision

> Source: [00-project-vision.md](./00-project-vision.md), refined
> 2026-07-27.

**Blank to Bold is an interactive product experience that transforms a
portfolio from a collection of projects into a memorable journey through a
designer's way of thinking.**

The guiding sentence for every future decision:

> Blank to Bold exists to help people experience how I think as a product
> designer — not just view the work I've created.

Treated as a digital product, not a personal website. The feeling being
built toward:

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
> constraint" + [10-roadmap.md](./10-roadmap.md) + Rehan's answers,
> 2026-07-27.

**Engineering/process goals (confirmed earlier):**

- Engineer the project "with the same care as a high-quality SaaS product,"
  expected to evolve over time — not a one-off static site.
- Think in systems, not pages; don't rush into building pages before the
  technical foundation is solid.
- Ship a public Experience that never hardcodes content, backed by a Studio
  that lets the creator manage everything without touching code.

**Honest goal (confirmed 2026-07-27):** not to impress people with
animations — to help people understand _how Rehan thinks_, not just what
he designed. A static portfolio only shows the final result; Blank to Bold
is meant to show the decisions, the reasoning, the failures, the
iterations, and the product thinking behind every project.

**Professional goal:** get hiring managers to spend _minutes_ exploring
the work instead of _seconds_ scanning it. Success is someone remembering
Rehan's way of thinking after closing the browser.

**Career goal:** shift perception from "a UI designer" to "a Product
Designer who understands systems, user experience, engineering, and
storytelling."

**Long-term goal:** Blank to Bold is not just a portfolio — it's the
foundation of a personal brand. Over time it's meant to grow into a
platform publishing case studies, design thinking, product experiments,
articles, talks, open-source design resources, and personal journey
content. The portfolio is the first chapter, not the final product. (This
directly validates the Blog/Playground/Career-Timeline modules already
designed in [16-studio-modules.md](./16-studio-modules.md) — the backend
was built to accommodate exactly this kind of growth without needing
architectural changes.)

## 5. Target Audience — Confirmed (2026-07-27)

**Primary (80%): Hiring Managers, Product Design Leads, and Design
Directors at product companies.** The people who make or strongly
influence hiring decisions. They don't just want attractive screens — they
want to understand how Rehan thinks, solves problems, communicates, and
builds products. What they need to be able to tell, without reading a
traditional résumé: can this designer think like a product designer?
Handle complex systems? Understand UX beyond visuals? Collaborate with
engineers? Own features from concept to execution?

**Secondary (15%): Founders, startups, and potential freelance clients.**
Care less about a perfect design process, more about whether Rehan can
understand a business problem and deliver a product users actually enjoy.
Should leave the site thinking "this is someone I'd trust to design our
product."

**Tertiary (5%): Other designers, students, and the design community.**
Not the main target, but if they enjoy the experience they naturally share
it — increasing visibility and strengthening the personal brand (see the
Long-term Goal in §4).

## 6. User Personas

> **Still pending — deliberately not drafted here.**

§5 unblocks this (audience is now known), but concrete personas need more
specificity than a percentage breakdown provides — company type/size,
seniority, a name, a scenario. Drafting them now would mean inventing
those specifics. This is now a small, well-scoped task rather than a
blocked one — worth doing as its own step (a dedicated `USER_PERSONAS.md`)
once wanted, not squeezed in here.

## 7. User Problems — Confirmed (synthesized from §4, 2026-07-27)

Not stated as a standalone "user problem" statement anywhere, but directly
inferable from Rehan's own stated reasoning without adding anything new:
**hiring managers and design leads can't tell how a candidate actually
thinks from a typical portfolio.** A static project gallery shows the
final screens, not the decisions, reasoning, failures, or iteration behind
them — so evaluators are left scanning visuals in seconds rather than
understanding the thinking in minutes, which is precisely the gap the
Honest Goal (§4) exists to close.

Caveat: this is the creator's own framing of the problem, not something
validated with the actual audience (interviews, feedback, etc.) — worth
being aware it's a reasonable hypothesis, not confirmed research.

## 8. Value Proposition — Confirmed (2026-07-27)

For hiring managers/design leads (§5) who can't tell how a candidate
thinks from a typical portfolio (§7): Blank to Bold shows the decisions,
reasoning, failures, and iteration behind the work, not just the final
screens — through an interactive journey rather than a static gallery.
Instead of scanning a portfolio for seconds, they spend minutes actually
understanding Rehan's product thinking, and remember it after they leave.

This combines what was already documented (the stylistic differentiation —
[01-design-principles.md](./01-design-principles.md) principle 9, "never
copy another portfolio," original story-driven systems) with what's now
confirmed (§4, §5, §7) to complete the _why it matters to the visitor_
half that was previously missing.

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

**Qualitative metric (confirmed 2026-07-27):** "if someone remembers my
way of thinking after closing the browser, the portfolio has succeeded"
(§4, Professional goal). Deliberately not a number — the stated bar is
memorability of thinking, not a conversion event.

**Technical metric (confirmed earlier):** "Target an excellent Lighthouse
score" — [01-design-principles.md](./01-design-principles.md#performance-budget).

**Still pending:** a quantitative product metric (time-on-page for case
studies, inquiries generated, return visits, etc.) hasn't been set. Not
blocking — the qualitative bar above is a real, usable success definition
on its own — but worth deciding before Sprint 3 if measurement/analytics
work is wanted later.

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

> Updated 2026-07-27 — most of this section is now resolved; see §4/§5/§7/§8.

**Still open:**

- **Story architecture** — the narrative arc, chapters/acts, and
  emotional/tonal shifts of the experience are undefined
  ([07-story-architecture.md](./07-story-architecture.md)); this blocks the
  scene map ([08-scene-map.md](./08-scene-map.md)) and what actual scenes
  exist. (The Experience Shell — scene orchestration, transitions,
  progress — is now built as generic infrastructure; see
  [03-folder-architecture.md](./03-folder-architecture.md#the-experience-shell).
  Content is what's still missing.) Now has real seed material from §4's
  Honest Goal.
- **Brand direction** — no color palette, voice, or brand identity exists
  beyond shadcn's neutral placeholder theme.
- **Typography** — still placeholder (Geist), no font decision made.
- **User personas** (§6) — deferred by choice, not blocked; small task
  whenever wanted.
- **Quantitative success metrics** (§10) — non-blocking; a qualitative bar
  is already confirmed.
- Timeline/deadline/external stakeholder, if any (§14) — still unstated.

**Resolved 2026-07-27:** target audience, user problem(s), the underlying
honest/professional/career/long-term goal, value proposition. See §4, §5,
§7, §8.

## 16. Risks

> Synthesized from the open questions above — these are logical
> consequences of documented gaps, not new claims about the product.

- **Building the wrong experience — reduced, not eliminated.** Audience
  (§5) and user problem (§7) are now defined, which removes most of this
  risk. What remains: the problem statement (§7) is the creator's own
  framing, not something validated with the actual audience — worth
  revisiting if real feedback ever contradicts it.
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

> **Updated 2026-07-27** after Rehan answered the two blocking questions
> (target audience, underlying goal) directly. Original verdict (No) is
> preserved below with a strikethrough-equivalent note, not deleted —
> the reasoning still matters for what's still genuinely open.

### Do we know enough about the product to start architecture?

**Closer, but still not fully — two items away, not eight.**

Target audience (§5), the underlying goal (§4), the user problem (§7), and
a value proposition (§8) are now confirmed — that was the largest and most
foundational gap, and it's resolved. The _technical_ architecture was
already thoroughly designed and reviewed
([13](./13-backend-architecture.md)–[17](./17-engineering-review.md)) and
remains unaffected either way.

What's still open, and still blocks `features/` (the Experience's
story-driven units) specifically:

- **Story architecture** ([07-story-architecture.md](./07-story-architecture.md)) —
  the narrative arc. Now has real material to be built from (§4's Honest
  Goal — "decisions, reasoning, failures, iterations" — is close to a
  seed for this), but hasn't been written yet.
- **Brand direction and typography** — visual identity, still undecided.

Everything else that was previously listed as a dependency (personas,
success metrics) is either resolved enough to proceed or explicitly
non-blocking (§6, §10).

### Missing product decisions before Sprint 3

Was 8 items in dependency order; now 2, neither blocking the other:

1. **Story architecture** — the narrative arc (acts/beats/tone). Depends
   on audience+goal, which are now known — this is now genuinely
   buildable, not blocked.
2. **Brand direction** (incl. typography) — visual identity. Independent
   of story; can happen in parallel.

**Resolved this round:** target audience, user problem, underlying
goal (honest/professional/career/long-term), value proposition, and a
qualitative success metric.

**Still explicitly non-blocking, deferred by choice not dependency:** user
personas (§6) — small, well-scoped, can be drafted whenever wanted, not a
prerequisite for the two items above. Quantitative success metrics (§10) —
the qualitative bar is a real, sufficient success definition on its own.

**What can proceed regardless, unchanged from before:** the backend
implementation validated in
[17-engineering-review.md](./17-engineering-review.md)'s recommendation
(one real service + one real Route Handler, Prisma installed, first
migration run) — infrastructure, already fully designed, never depended on
any product question.
