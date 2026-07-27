"use client";

import { useEffect } from "react";
import { useExperienceStore } from "@/stores/experience-store";
import { ExperienceContext } from "@/providers/experience-context";
import {
  getNextSceneId,
  getPreviousSceneId,
} from "@/systems/experience/scene-manager.engine";
import { calculateProgress } from "@/systems/experience/progress.engine";
import type { SceneId } from "@/systems/experience/experience.types";

export function ExperienceProvider({
  sceneIds,
  initialSceneId,
  children,
}: {
  sceneIds: SceneId[];
  initialSceneId?: SceneId;
  children: React.ReactNode;
}) {
  const registerScenes = useExperienceStore((state) => state.registerScenes);
  const goToScene = useExperienceStore((state) => state.goToScene);
  const markEntered = useExperienceStore((state) => state.markEntered);
  const setTransitionPhase = useExperienceStore(
    (state) => state.setTransitionPhase,
  );
  const sceneIdsState = useExperienceStore((state) => state.sceneIds);
  const activeSceneId = useExperienceStore((state) => state.activeSceneId);
  const previousSceneId = useExperienceStore((state) => state.previousSceneId);
  const transitionPhase = useExperienceStore((state) => state.transitionPhase);
  const hasEntered = useExperienceStore((state) => state.hasEntered);

  useEffect(() => {
    registerScenes(sceneIds, initialSceneId);
  }, [sceneIds, initialSceneId, registerScenes]);

  return (
    <ExperienceContext.Provider
      value={{
        sceneIds: sceneIdsState,
        activeSceneId,
        previousSceneId,
        transitionPhase,
        setTransitionPhase,
        progress: calculateProgress(sceneIdsState, activeSceneId),
        hasEntered,
        goToScene,
        next: () => {
          const nextId = getNextSceneId(sceneIdsState, activeSceneId);
          if (nextId) goToScene(nextId);
        },
        previous: () => {
          const previousId = getPreviousSceneId(sceneIdsState, activeSceneId);
          if (previousId) goToScene(previousId);
        },
        markEntered,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}
