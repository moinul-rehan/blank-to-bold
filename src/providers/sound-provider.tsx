"use client";

import { useEffect } from "react";
import { useSoundStore } from "@/stores/sound-store";

const STORAGE_KEY = "b2b-sound-muted";

export { useSoundStore } from "@/stores/sound-store";

/** Syncs the mute preference with localStorage. No audio assets exist yet. */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) useSoundStore.setState({ muted: stored === "true" });

    return useSoundStore.subscribe((state) => {
      localStorage.setItem(STORAGE_KEY, String(state.muted));
    });
  }, []);

  return <>{children}</>;
}
