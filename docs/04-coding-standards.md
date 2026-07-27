# 04 — Coding Standards

See also [12-engineering-rules.md](./12-engineering-rules.md) for narrower,
numbered rules (e.g. Rule #001: design tokens live only in CSS, never
duplicated in TS).

- Strict TypeScript (`strict: true`). No `any` unless absolutely unavoidable
  — and when unavoidable, comment why.
- Clear naming conventions. Names should make comments unnecessary.
- Self-documenting code over clever code.
- Small, focused, reusable components — one responsibility each.
- Meaningful comments only when necessary: explain _why_, not _what_. If
  removing a comment wouldn't confuse a future reader, don't write it.
- Optimize for readability over brevity or cleverness.
- No over-engineering: don't build abstractions for hypothetical future
  requirements. Solve the problem in front of you.
- No half-finished implementations, no dead code, no commented-out blocks
  left behind.

## Review checklist before considering something "done"

- [ ] Strict TypeScript passes, no unjustified `any`
- [ ] Component/file is small and single-purpose
- [ ] No duplicated logic that should be a shared system/hook/util
- [ ] Accessible: keyboard nav, screen reader labels, focus states,
      `prefers-reduced-motion` respected where animation is involved
- [ ] No console errors/warnings
- [ ] Naming is self-explanatory without needing a comment
