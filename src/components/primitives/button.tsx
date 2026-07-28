import type { ComponentProps } from "react";

/** Structural only — no variant/size/color styling. */
export type ButtonProps = ComponentProps<"button">;

export function Button({ type = "button", ...props }: ButtonProps) {
  return <button data-slot="button" type={type} {...props} />;
}
