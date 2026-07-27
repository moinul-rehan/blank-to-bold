"use client";

import { createContext, useContext } from "react";
import type {
  SceneDefinition,
  SceneId,
} from "@/systems/experience/scene.types";
import type { SceneRegistry } from "@/systems/experience/scene-registry";
import type { SceneLifecycleState } from "@/systems/experience/scene-lifecycle";

export type ExperienceContextValue = {
  registry: SceneRegistry;
  /** The active scene's full definition — transition, background, interaction profile, etc. */
  activeScene: SceneDefinition | undefined;
  activeSceneId: SceneId | null;
  previousSceneId: SceneId | null;
  lifecycle: SceneLifecycleState;
  setLifecycle: (state: SceneLifecycleState) => void;
  /** 0–1 fraction through the registered scenes, by position. */
  progress: number;
  hasEntered: boolean;
  goToScene: (id: SceneId) => void;
  next: () => void;
  previous: () => void;
  markEntered: () => void;
};

export const ExperienceContext = createContext<ExperienceContextValue | null>(
  null,
);

/** Access the active Experience Shell's state/controls. Must be used inside an ExperienceProvider. */
export function useExperience(): ExperienceContextValue {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience must be used within an ExperienceProvider");
  }
  return context;
}
