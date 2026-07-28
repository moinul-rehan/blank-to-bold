import type { ComponentProps } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = {
  /** Semantic level — required, not defaulted, since the correct level always depends on document structure. */
  level: HeadingLevel;
} & Omit<ComponentProps<"h1">, "level">;

/** Structural only — no font-size/weight/color styling. */
export function Heading({ level, ...props }: HeadingProps) {
  const Component = `h${level}` as const;
  return <Component data-slot="heading" {...props} />;
}
