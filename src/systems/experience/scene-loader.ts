import type { ComponentType } from "react";
import type {
  SceneDefinition,
  SceneId,
} from "@/systems/experience/scene.types";
import { emitSceneEvent } from "@/systems/experience/scene-events";

const cache = new Map<SceneId, ComponentType>();
const inFlight = new Map<SceneId, Promise<ComponentType>>();

/** A scene's component if it's already resolved — lets the renderer skip a loading state. */
export function getLoadedScene(id: SceneId): ComponentType | undefined {
  return cache.get(id);
}

/**
 * Resolves a scene's component, caching it. Concurrent calls for the same
 * scene share one in-flight promise, so a scene is never fetched twice.
 * Progress is reported through the scene event bus rather than returned,
 * so non-React subscribers can react to it too.
 */
export function loadScene(definition: SceneDefinition): Promise<ComponentType> {
  const cached = cache.get(definition.id);
  if (cached) return Promise.resolve(cached);

  const existing = inFlight.get(definition.id);
  if (existing) return existing;

  emitSceneEvent("scene:load-start", { sceneId: definition.id });

  const promise = (async () => {
    try {
      const resolved = definition.component();
      const component =
        resolved instanceof Promise ? (await resolved).default : resolved;
      cache.set(definition.id, component);
      emitSceneEvent("scene:load-complete", { sceneId: definition.id });
      return component;
    } catch (error) {
      emitSceneEvent("scene:load-error", { sceneId: definition.id, error });
      throw error;
    } finally {
      inFlight.delete(definition.id);
    }
  })();

  inFlight.set(definition.id, promise);
  return promise;
}

/**
 * Warms the cache ahead of activation. No-op for `eager` scenes (already
 * bundled). Rejections are not rethrown — a failed preload is only a lost
 * optimization, the error is already reported via `scene:load-error`, and
 * the real `loadScene` call will retry and surface it properly.
 */
export function preloadScene(definition: SceneDefinition): void {
  if (definition.loadingStrategy === "eager") return;
  void loadScene(definition).catch(() => {});
}
