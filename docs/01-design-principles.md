# 01 — Design Principles

1. **Experience before interface.** The feeling of moving through the site
   matters more than any single screen.
2. **Story before decoration.** Every visual choice should serve the
   narrative, not exist for its own sake.
3. **Motion with purpose.** See [05-motion-language.md](./05-motion-language.md).
4. **Simplicity over complexity.** If a simpler solution tells the same
   story, take it.
5. **Performance over flashy effects.** See
   [02-tech-stack.md](./02-tech-stack.md) and the performance budget below.
6. **Accessibility is mandatory.** Never a stretch goal, never traded away
   for a visual effect.
7. **Desktop-first, but fully responsive.** Design and build for desktop
   first, but every experience must hold up on mobile/tablet.
8. **Every interaction should feel intentional.** See
   [06-interaction-library.md](./06-interaction-library.md).
9. **Never copy another portfolio.** Reference for inspiration, not for
   reproduction.
10. **Build original systems.** Reusable, named systems — not one-off
    effects bolted onto a page.

## Interaction philosophy

Every interaction must answer one question: **"Why does this exist?"**
If there is no meaningful answer, remove it.

## Performance budget

Performance is part of the design, not a tradeoff against it. Optimize:

- Images
- Fonts
- JavaScript
- Animations
- Rendering

Target an excellent Lighthouse score.

## Accessibility requirements

Always support:

- Keyboard navigation
- Screen readers
- `prefers-reduced-motion`
- Color contrast
- Visible focus states
