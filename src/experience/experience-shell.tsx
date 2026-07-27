"use client";

import { ExperienceProvider } from "@/providers/experience-provider";
import { SceneManager } from "@/experience/scene-manager";
import { SceneTransitionManager } from "@/experience/scene-transition-manager";
import { GlobalLayout } from "@/experience/layout/global-layout";
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
 * transitions, progress, and composes the Global Layout's nine layers —
 * nothing about any specific scene is known or hardcoded here.
 *
 * `SceneTransitionManager` (the Scene System's actual transition logic)
 * renders inside `GlobalLayout`'s generic `TransitionLayer` — the two
 * stay isolated: `TransitionLayer` owns positioning/z-index,
 * `SceneTransitionManager` owns what happens during a scene change.
 */
export function ExperienceShell({
  scenes,
  initialSceneId,
}: ExperienceShellProps) {
  return (
    <ExperienceProvider scenes={scenes} initialSceneId={initialSceneId}>
      <GlobalLayout debug={<DebugMode />}>
        <SceneTransitionManager>
          <SceneManager />
        </SceneTransitionManager>
      </GlobalLayout>
    </ExperienceProvider>
  );
}
