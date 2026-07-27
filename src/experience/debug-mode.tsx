"use client";

import { useExperience } from "@/providers/experience-context";

/** Development-only HUD showing live Experience Shell state. Renders nothing in production. */
export function DebugMode() {
  const {
    activeSceneId,
    previousSceneId,
    transitionPhase,
    progress,
    sceneIds,
  } = useExperience();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[var(--z-toast)] rounded-md bg-black/80 p-3 font-mono text-xs text-white">
      <div>scene: {activeSceneId ?? "none"}</div>
      <div>previous: {previousSceneId ?? "none"}</div>
      <div>phase: {transitionPhase}</div>
      <div>progress: {Math.round(progress * 100)}%</div>
      <div>scenes: {sceneIds.join(", ") || "none"}</div>
    </div>
  );
}
