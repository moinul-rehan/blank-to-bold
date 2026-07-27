"use client";

import { useExperience } from "@/providers/experience-context";

/** Development-only HUD showing live Experience Shell state. Renders nothing in production. */
export function DebugMode() {
  const {
    activeScene,
    activeSceneId,
    previousSceneId,
    lifecycle,
    progress,
    registry,
  } = useExperience();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[var(--z-toast)] rounded-md bg-black/80 p-3 font-mono text-xs text-white">
      <div>scene: {activeSceneId ?? "none"}</div>
      <div>title: {activeScene?.title ?? "—"}</div>
      <div>previous: {previousSceneId ?? "none"}</div>
      <div>lifecycle: {lifecycle}</div>
      <div>transition: {activeScene?.transition.type ?? "—"}</div>
      <div>loading: {activeScene?.loadingStrategy ?? "—"}</div>
      <div>progress: {Math.round(progress * 100)}%</div>
      <div>registered: {registry.ids.join(", ") || "none"}</div>
    </div>
  );
}
