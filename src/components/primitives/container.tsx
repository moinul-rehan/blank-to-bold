import type { ComponentProps, CSSProperties } from "react";

export type ContainerProps = {
  /** CSS `max-width` value — e.g. `"var(--layout-max-width)"`. Not defaulted: the value is a design decision, this primitive only plumbs it. */
  maxWidth?: CSSProperties["maxWidth"];
} & ComponentProps<"div">;

/** Structural only — centers content and caps its width, nothing else. */
export function Container({ maxWidth, style, ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      style={{ ...style, maxWidth, marginInline: maxWidth ? "auto" : undefined }}
      {...props}
    />
  );
}
