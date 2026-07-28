import { createElement, type ComponentProps, type ElementType } from "react";

export type TextProps<T extends ElementType = "p"> = {
  /** Which element to render — defaults to `p`. No default is more "correct" than another at this layer. */
  as?: T;
} & Omit<ComponentProps<T>, "as">;

/**
 * Structural only — no font-size/weight/color styling. Uses `createElement`
 * rather than JSX for the dynamic tag: with `@react-three/fiber` installed,
 * its global `JSX.IntrinsicElements` augmentation breaks TS's inference for
 * an arbitrary `ElementType` variable used directly as a JSX tag.
 */
export function Text<T extends ElementType = "p">({ as, ...props }: TextProps<T>) {
  return createElement((as ?? "p") as ElementType, { "data-slot": "text", ...props });
}
