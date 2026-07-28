import type { ComponentProps, CSSProperties } from "react";

export type StackProps = {
  direction?: "row" | "column";
  gap?: CSSProperties["gap"];
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: CSSProperties["flexWrap"];
} & ComponentProps<"div">;

/** Structural only — the `display: flex` mechanism, no visual styling. */
export function Stack({
  direction = "column",
  gap,
  align,
  justify,
  wrap,
  style,
  ...props
}: StackProps) {
  return (
    <div
      data-slot="stack"
      style={{
        ...style,
        display: "flex",
        flexDirection: direction,
        gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap,
      }}
      {...props}
    />
  );
}
