# 09 — Component System

> **Status: seeded.** Layout structure exists; visual/design components
> don't yet (blocked on brand direction — see CONTEXT.md).

## Purpose

Living catalog of the reusable component library — the same spirit as a
design system's component docs, but for this project's actual code.

## Entry template

```
### <ComponentName>

- **Location:** src/components/<path>
- **Purpose:** what it's for
- **Variants/props:** key API surface
- **Built on:** which shadcn/ui primitive (if any)
- **Accessibility notes:** keyboard/screen-reader behavior
```

## Components

### Button

- **Location:** `src/components/ui/button.tsx`
- **Purpose:** shadcn-generated primitive. Not yet imported/used anywhere.
- **Variants/props:** `variant` (default/outline/secondary/ghost/destructive/link), `size` (default/xs/sm/lg/icon/icon-xs/icon-sm/icon-lg), via `class-variance-authority`.
- **Built on:** `@base-ui/react`'s `Button` primitive, shadcn `base-nova` style.
- **Accessibility notes:** inherited from Base UI's primitive; not independently audited yet.

### AppShell / Navbar / Main / Footer

- **Location:** `src/components/layout/`
- **Purpose:** the app shell — structural landmarks only, no visual design (see [03-folder-architecture.md](./03-folder-architecture.md)).
- **Variants/props:** none — `AppShell` takes `children`, composes `Navbar` + `Main` + `Footer`.
- **Built on:** plain semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`).
- **Accessibility notes:** `AppShell` includes a skip-to-content link (`#main-content`); `Main` is a proper `<main>` landmark with `tabIndex={-1}` as the skip-link target.
