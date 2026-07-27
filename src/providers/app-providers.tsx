"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { AnimationProvider } from "@/providers/animation-provider";
import { LenisProvider } from "@/providers/lenis-provider";
import { CursorProvider } from "@/providers/cursor-provider";
import { SoundProvider } from "@/providers/sound-provider";

/**
 * App-wide providers only. ExperienceProvider is deliberately not here —
 * it's scene-registry-driven (needs to know which scenes exist), so it's
 * owned by ExperienceShell wherever that gets mounted, not global.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <LenisProvider>
          <CursorProvider>
            <SoundProvider>{children}</SoundProvider>
          </CursorProvider>
        </LenisProvider>
      </AnimationProvider>
    </ThemeProvider>
  );
}
