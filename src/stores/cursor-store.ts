import { create } from "zustand";
import type { CursorVariant } from "@/systems/cursor/cursor.types";

export type { CursorVariant };

type CursorState = {
  variant: CursorVariant;
  setVariant: (variant: CursorVariant) => void;
};

export const useCursorStore = create<CursorState>((set) => ({
  variant: "default",
  setVariant: (variant) => set({ variant }),
}));
