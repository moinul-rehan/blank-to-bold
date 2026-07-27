import type { PointerType } from "@/systems/interaction/interaction.types";

const QUERY = "(pointer: fine)";

/** The active pointer type, read synchronously (client-only). */
export function getPointerType(): PointerType {
  if (typeof window === "undefined") return "coarse";
  return window.matchMedia(QUERY).matches ? "fine" : "coarse";
}

/** Notifies `callback` whenever the pointer type changes. Returns an unsubscribe function. */
export function subscribePointerType(
  callback: (pointerType: PointerType) => void,
): () => void {
  const mediaQueryList = window.matchMedia(QUERY);
  const listener = () => callback(getPointerType());
  mediaQueryList.addEventListener("change", listener);
  return () => mediaQueryList.removeEventListener("change", listener);
}
