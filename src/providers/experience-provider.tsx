"use client";

import { useEffect, useMemo } from "react";
import { useExperienceStore } from "@/stores/experience-store";
import { ExperienceContext } from "@/providers/experience-context";
import { createSceneRegistry } from "@/systems/experience/scene-registry";
import { preloadScene } from "@/systems/experience/scene-loader";
import { calculateProgress } from "@/systems/experience/progress.engine";
import type {
  SceneDefinition,
  SceneId,
} from "@/systems/experience/scene.types";

export function ExperienceProvider({
  scenes,
  initialSceneId,
  children,
}: {
  scenes: SceneDefinition[];
  initialSceneId?: SceneId;
  children: React.ReactNode;
}) {
  const registry = useMemo(() => createSceneRegistry(scenes), [scenes]);

  const registerScenes = useExperienceStore((state) => state.registerScenes);
  const goToScene = useExperienceStore((state) => state.goToScene);
  const setLifecycle = useExperienceStore((state) => state.setLifecycle);
  const markEntered = useExperienceStore((state) => state.markEntered);
  const sceneIds = useExperienceStore((state) => state.sceneIds);
  const activeSceneId = useExperienceStore((state) => state.activeSceneId);
  const previousSceneId = useExperienceStore((state) => state.previousSceneId);
  const lifecycle = useExperienceStore((state) => state.lifecycle);
  const hasEntered = useExperienceStore((state) => state.hasEntered);

  useEffect(() => {
    registerScenes(registry.ids, initialSceneId);
  }, [registry, initialSceneId, registerScenes]);

  // What `preload` means in practice: once a scene settles, fetch the next
  // one so its transition doesn't wait on the network.
  useEffect(() => {
    if (lifecycle !== "active" || !activeSceneId) return;
    const nextId = registry.next(activeSceneId);
    const nextScene = nextId ? registry.get(nextId) : undefined;
    if (nextScene?.loadingStrategy === "preload") preloadScene(nextScene);
  }, [lifecycle, activeSceneId, registry]);

  return (
    <ExperienceContext.Provider
      value={{
        registry,
        activeScene: activeSceneId ? registry.get(activeSceneId) : undefined,
        activeSceneId,
        previousSceneId,
        lifecycle,
        setLifecycle,
        progress: calculateProgress(sceneIds, activeSceneId),
        hasEntered,
        goToScene,
        next: () => {
          const nextId = registry.next(activeSceneId);
          if (nextId) goToScene(nextId);
        },
        previous: () => {
          const previousId = registry.previous(activeSceneId);
          if (previousId) goToScene(previousId);
        },
        markEntered,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}
