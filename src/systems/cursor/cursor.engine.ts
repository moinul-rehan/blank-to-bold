import type { CursorVariant } from "@/systems/cursor/cursor.types";

/** Elements opt into a cursor state with `<div data-cursor="hover">`. */
export const CURSOR_ATTRIBUTE = "data-cursor";

const KNOWN_VARIANTS: readonly CursorVariant[] = ["default", "hover", "text"];

function isCursorVariant(value: string): value is CursorVariant {
  return (KNOWN_VARIANTS as readonly string[]).includes(value);
}

/** Resolves the cursor variant for `target`, walking up to the nearest `data-cursor` ancestor. */
export function resolveCursorVariant(target: Element | null): CursorVariant {
  const source = target?.closest(`[${CURSOR_ATTRIBUTE}]`);
  const value = source?.getAttribute(CURSOR_ATTRIBUTE);
  return value && isCursorVariant(value) ? value : "default";
}
