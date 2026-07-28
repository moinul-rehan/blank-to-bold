import type { ComponentProps } from "react";

export type SectionProps = ComponentProps<"section">;

/** Structural only — a semantic landmark, no spacing/background styling. */
export function Section(props: SectionProps) {
  return <section data-slot="section" {...props} />;
}
