"use client";

import { useExperience } from "@/providers/experience-context";

/**
 * Development-only HUD showing live Experience Shell state. Renders
 * nothing in production. Expects to be rendered inside a positioned
 * container (the Global Layout's `DebugLayer` — `@/experience/layout/debug-layer`)
 * which owns the fixed placement/z-index; this only positions itself
 * within that container.
 */
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
    <div className="pointer-events-auto absolute bottom-4 left-4 rounded-md bg-black/80 p-3 font-mono text-xs text-white">
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
