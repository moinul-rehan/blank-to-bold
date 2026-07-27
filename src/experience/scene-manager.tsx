"use client";

import type { ComponentType } from "react";
import { useExperience } from "@/providers/experience-context";
import type { SceneId } from "@/systems/experience/experience.types";

export type SceneRegistry = Record<SceneId, ComponentType>;

/** Renders whichever scene is currently active. Has no knowledge of what scenes exist. */
export function SceneManager({ registry }: { registry: SceneRegistry }) {
  const { activeSceneId } = useExperience();
  if (!activeSceneId) return null;

  const ActiveScene = registry[activeSceneId];
  if (!ActiveScene) return null;

  return <ActiveScene />;
}
