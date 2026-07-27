import { create } from "zustand";

type ExperienceState = {
  /** Whether the initial load/intro sequence has finished. */
  hasEntered: boolean;
  markEntered: () => void;
};

export const useExperienceStore = create<ExperienceState>((set) => ({
  hasEntered: false,
  markEntered: () => set({ hasEntered: true }),
}));
