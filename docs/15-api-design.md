# 15 — API Design

> **Status: design draft.** No route handlers exist yet.

## Route Handlers, not raw Server Actions calling Prisma

**Decision:** Studio mutations go through typed REST-style Route Handlers
(`app/(studio)/api/**/route.ts`), not Server Actions that call Prisma
directly from a form.

Server Actions are still allowed as thin wrappers _around_ a service call
for form-submission ergonomics — but the business logic and Prisma call
live in `src/services/`, never in the action itself. The reason for
committing to Route Handlers as the actual API layer:

- It's a real, inspectable contract (method + path + typed request/response),
  independent of whatever UI framework Studio's forms happen to use.
- It's what makes the future monorepo split
  ([13-backend-architecture.md](./13-backend-architecture.md#app-topology-one-nextjs-app-two-route-groups))
  mechanical — `apps/studio` in a monorepo would call these same endpoints
  over HTTP instead of in-process; nothing about the endpoint shape changes.
- It directly satisfies the brief's requirement: "Do not expose database
  logic directly" — a route handler that imports Prisma would violate this
  as much as a page component would.

## Convention

```
app/(studio)/api/projects/route.ts        GET (list), POST (create)
app/(studio)/api/projects/[id]/route.ts   GET, PATCH, DELETE
```

Same pattern per resource: `categories`, `tags`, `skills`, `companies`,
`media`, `career-entries`, `blog-posts`, `playground-items`, `settings/site`,
`settings/experience`. Nested resources (e.g. a project's blocks) live
under their parent: `app/(studio)/api/projects/[id]/blocks/route.ts`.

## Request lifecycle (every Studio route, no exceptions)

1. **Auth check** — Better Auth session verified (via middleware on
   `app/(studio)/**`, so individual routes don't each re-implement this).
2. **Parse + validate** — request body/query parsed against the resource's
   Zod schema from `src/validation/`. Invalid input never reaches a
   service.
3. **Delegate to a service** — `src/services/project.service.ts` (etc.)
   does the actual Prisma call. The route handler contains no business
   logic and no Prisma import.
4. **Typed response** — the service's return type flows through to the
   route's response type; the client (Studio UI) gets a typed contract, not
   `any`.

```
Studio UI → fetch("/api/projects", { method: "POST", body })
          → Route Handler: auth → Zod.parse → ProjectService.create(data)
          → Service: prisma.project.create(...)
          → typed Project back to the client
```

## Experience reads don't go through HTTP

Experience Server Components call the same service functions
(`ProjectService.listPublished()`, etc.) directly — no `fetch` to its own
API, since it's in-process in the same Next.js server and a self-HTTP-call
would just be latency with no isolation benefit today. It's still going
through the identical service boundary Studio uses, so the "frontend never
touches Prisma" rule holds for both sides equally; only the transport
differs (direct call vs. Route Handler), because both consumers currently
live in the same process.

If Experience is ever split into its own app/deployment
([13](./13-backend-architecture.md)), it switches from calling
`ProjectService` directly to calling these same Route Handlers over HTTP —
the service signatures don't change, only who's allowed to call them
in-process vs. over the network.

## Error shape

Every error response:

```ts
{
  error: {
    code: string;
    message: string;
  }
}
```

with the matching HTTP status (400 validation, 401 unauthenticated, 404 not
found, 409 conflict e.g. duplicate slug, 500 unexpected). Not a bare string,
not an inconsistent shape per route — Studio's API client can handle errors
generically.

## Security notes

- Every `(studio)` route (pages and API) sits behind the auth middleware —
  denylist-by-default, not each route remembering to check.
- Slugs are validated + uniqueness-checked at the service layer (the schema
  also enforces `@unique`, so a race condition still fails safely as a DB
  constraint violation, mapped to a `409`).
- File uploads go through `src/storage/` (the `StorageAdapter`), which
  validates mime type/size before handing off to `LocalStorageAdapter` /
  future `CloudinaryAdapter`/`S3Adapter` — never a raw filesystem write from
  a route handler.

## Versioning

Not needed yet — there's exactly one consumer (this app, both sides of it).
The service-layer boundary means introducing `/api/v1/**` later, if an
external consumer ever appears, doesn't require touching the services
themselves — just the route handlers that expose them.
