"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { AnimationProvider } from "@/providers/animation-provider";
import { LenisProvider } from "@/providers/lenis-provider";
import { CursorProvider } from "@/providers/cursor-provider";
import { SoundProvider } from "@/providers/sound-provider";
import { ExperienceProvider } from "@/providers/experience-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <LenisProvider>
          <CursorProvider>
            <SoundProvider>
              <ExperienceProvider>{children}</ExperienceProvider>
            </SoundProvider>
          </CursorProvider>
        </LenisProvider>
      </AnimationProvider>
    </ThemeProvider>
  );
}
