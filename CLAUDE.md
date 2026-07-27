# Blank to Bold

An interactive product experience that transforms a portfolio from a
collection of projects into a memorable journey through a designer's way
of thinking — a digital product, not a portfolio site. See
[00-project-vision.md](./docs/00-project-vision.md) for the full vision
and the guiding sentence every decision gets measured against.

Two connected products: **Blank to Bold Experience** (the public site,
renders content only) and **Blank to Bold Studio** (the private creator
platform that manages all of it — see
[13-backend-architecture.md](./docs/13-backend-architecture.md)). The
Experience never hardcodes content; everything comes from the backend.

Full project knowledge lives in [`docs/`](./docs) — read it, don't duplicate
it here:

- [00-project-vision.md](./docs/00-project-vision.md)
- [01-design-principles.md](./docs/01-design-principles.md)
- [02-tech-stack.md](./docs/02-tech-stack.md)
- [03-folder-architecture.md](./docs/03-folder-architecture.md)
- [04-coding-standards.md](./docs/04-coding-standards.md)
- [05-motion-language.md](./docs/05-motion-language.md)
- [06-interaction-library.md](./docs/06-interaction-library.md)
- [07-story-architecture.md](./docs/07-story-architecture.md)
- [08-scene-map.md](./docs/08-scene-map.md)
- [09-component-system.md](./docs/09-component-system.md)
- [10-roadmap.md](./docs/10-roadmap.md)
- [11-design-tokens.md](./docs/11-design-tokens.md)
- [12-engineering-rules.md](./docs/12-engineering-rules.md)
- [13-backend-architecture.md](./docs/13-backend-architecture.md)
- [14-database-schema.md](./docs/14-database-schema.md)
- [15-api-design.md](./docs/15-api-design.md)
- [16-studio-modules.md](./docs/16-studio-modules.md)
- [17-engineering-review.md](./docs/17-engineering-review.md)
- [18-product-definition.md](./docs/18-product-definition.md)

Current state (what's decided, what's open, what's next) is tracked in
[CONTEXT.md](./CONTEXT.md) — check it at the start of every session.

## Roles

As of 2026-07-27, Rehan works with **Claude Code alone** — ChatGPT is no
longer part of this project. Claude Code now covers both:

- **Product Architect / UX Strategist / Experience Director** — product
  thinking, audience/persona/story decisions, experience direction. This
  work happens through direct conversation with Rehan (not invented
  unilaterally), and gets written into `docs/` the same way engineering
  decisions do — see [18-product-definition.md](./docs/18-product-definition.md)
  for the current state of product definition, including what's still
  genuinely undecided.
- **Lead Frontend Engineer / Technical Architect** — translates whatever's
  decided into clean, scalable, production-ready code.

Previously ChatGPT held the product/UX half of this split; historical docs
(00–18) that reference "the Product Architect" mean that arrangement at the
time they were written, not a currently active third party.

## Non-negotiable collaboration rules

- Before implementing anything that changes the overall architecture:
  explain the architecture, explain trade-offs, suggest improvements, and
  wait for approval.
- Don't assume — ask when product direction is unclear.
- Don't rush into building pages before the technical foundation is solid.
- Keep `docs/` and `CONTEXT.md` up to date as decisions are made — they are
  the project's brain, not just notes.
