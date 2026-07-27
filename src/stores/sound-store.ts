import { create } from "zustand";

type SoundState = {
  muted: boolean;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
};

export const useSoundStore = create<SoundState>((set) => ({
  // Muted by default: audio must never autoplay unprompted — the user opts in.
  muted: true,
  setMuted: (muted) => set({ muted }),
  toggleMuted: () => set((state) => ({ muted: !state.muted })),
}));
