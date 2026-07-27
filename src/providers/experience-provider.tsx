"use client";

export { useExperienceStore } from "@/stores/experience-store";

/**
 * Placeholder for the overall experience state machine (intro sequence,
 * chapter/act tracking, etc.) — real shape depends on the story architecture
 * (docs/07-story-architecture.md), which isn't defined yet. For now this
 * just makes `hasEntered` available app-wide via the store.
 */
export function ExperienceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
