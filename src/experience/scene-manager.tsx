"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useExperience } from "@/providers/experience-context";
import { getLoadedScene, loadScene } from "@/systems/experience/scene-loader";
import type {
  SceneBackground,
  SceneDefinition,
} from "@/systems/experience/scene.types";

/** Renders whichever scene is active. Has no knowledge of what any scene contains. */
export function SceneManager() {
  const { activeScene } = useExperience();
  if (!activeScene) return null;
  // Keyed per scene so each activation gets a fresh renderer — lets an
  // already-cached scene resolve synchronously on mount instead of
  // flashing a loading state.
  return <SceneRenderer key={activeScene.id} scene={activeScene} />;
}

function SceneRenderer({ scene }: { scene: SceneDefinition }) {
  const { setLifecycle } = useExperience();
  const [Component, setComponent] = useState<ComponentType | null>(
    () => getLoadedScene(scene.id) ?? null,
  );

  useEffect(() => {
    if (Component) {
      // Re-runs once after the async load resolves; the lifecycle state
      // machine ignores the redundant transition.
      setLifecycle("entering");
      return;
    }

    let cancelled = false;
    setLifecycle("loading");
    loadScene(scene)
      .then((loaded) => {
        if (cancelled) return;
        setComponent(() => loaded);
        setLifecycle("entering");
      })
      .catch(() => {
        if (!cancelled) setLifecycle("error");
      });

    return () => {
      cancelled = true;
    };
  }, [scene, Component, setLifecycle]);

  if (!Component) return null;

  return (
    <div className="relative" data-scene={scene.id}>
      <SceneBackgroundLayer background={scene.background} />
      <Component />
    </div>
  );
}

function SceneBackgroundLayer({ background }: { background: SceneBackground }) {
  if (background.kind === "transparent") return null;

  if (background.kind === "custom") {
    const Background = background.component;
    return <Background />;
  }

  // Token-only, never a raw color — keeps Engineering Rule #001 intact.
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10"
      style={{ backgroundColor: `var(--${background.token})` }}
    />
  );
}
