import { create } from "zustand";
import type { Theme } from "@/systems/theme/theme.types";

export type { Theme };

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system",
  setTheme: (theme) => set({ theme }),
}));
