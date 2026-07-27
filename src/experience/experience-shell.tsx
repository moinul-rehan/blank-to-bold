"use client";

import { ExperienceProvider } from "@/providers/experience-provider";
import { SceneManager } from "@/experience/scene-manager";
import { SceneTransitionManager } from "@/experience/scene-transition-manager";
import { OverlayLayer } from "@/experience/overlay-layer";
import { DebugMode } from "@/experience/debug-mode";
import type {
  SceneDefinition,
  SceneId,
} from "@/systems/experience/scene.types";

export type ExperienceShellProps = {
  /** Every scene this experience can show. Order comes from each scene's `order`, not this array. */
  scenes: SceneDefinition[];
  initialSceneId?: SceneId;
};

/**
 * The root of the interactive experience. Owns scene orchestration,
 * transitions, progress, and a slot for cross-scene overlay UI — nothing
 * about any specific scene is known or hardcoded here.
 */
export function ExperienceShell({
  scenes,
  initialSceneId,
}: ExperienceShellProps) {
  return (
    <ExperienceProvider scenes={scenes} initialSceneId={initialSceneId}>
      <SceneTransitionManager>
        <SceneManager />
      </SceneTransitionManager>
      <OverlayLayer />
      <DebugMode />
    </ExperienceProvider>
  );
}
