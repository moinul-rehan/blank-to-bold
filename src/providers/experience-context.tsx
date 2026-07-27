"use client";

import { createContext, useContext } from "react";
import type {
  SceneId,
  TransitionPhase,
} from "@/systems/experience/experience.types";

export type ExperienceContextValue = {
  sceneIds: SceneId[];
  activeSceneId: SceneId | null;
  previousSceneId: SceneId | null;
  transitionPhase: TransitionPhase;
  setTransitionPhase: (phase: TransitionPhase) => void;
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
