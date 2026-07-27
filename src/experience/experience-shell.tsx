"use client";

import { useMemo } from "react";
import { ExperienceProvider } from "@/providers/experience-provider";
import { SceneManager, type SceneRegistry } from "@/experience/scene-manager";
import { SceneTransitionManager } from "@/experience/scene-transition-manager";
import { OverlayLayer } from "@/experience/overlay-layer";
import { DebugMode } from "@/experience/debug-mode";
import type { SceneId } from "@/systems/experience/experience.types";

export type ExperienceShellProps = {
  /** Every scene this experience can show. The Shell has no knowledge of what any of them contain. */
  scenes: SceneRegistry;
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
  const sceneIds = useMemo(() => Object.keys(scenes), [scenes]);

  return (
    <ExperienceProvider sceneIds={sceneIds} initialSceneId={initialSceneId}>
      <SceneTransitionManager>
        <SceneManager registry={scenes} />
      </SceneTransitionManager>
      <OverlayLayer />
      <DebugMode />
    </ExperienceProvider>
  );
}
