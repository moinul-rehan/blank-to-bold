import type { SceneId } from "@/systems/experience/scene.types";

export type SceneEventMap = {
  "scene:load-start": { sceneId: SceneId };
  "scene:load-complete": { sceneId: SceneId };
  "scene:load-error": { sceneId: SceneId; error: unknown };
  "scene:enter-start": { sceneId: SceneId };
  "scene:enter-complete": { sceneId: SceneId };
  "scene:exit-start": { sceneId: SceneId };
  "scene:exit-complete": { sceneId: SceneId };
  "scene:change": { from: SceneId | null; to: SceneId };
};

export type SceneEventName = keyof SceneEventMap;

type Handler<E extends SceneEventName> = (payload: SceneEventMap[E]) => void;

/**
 * Scene event bus — lets features react to scene changes (analytics, sound,
 * preloading the next scene) without the shell importing any of them.
 * Deliberately a standalone emitter rather than React state: subscribers are
 * often non-React (the sound system, a GSAP timeline) and shouldn't force
 * a re-render.
 */
const handlers = new Map<SceneEventName, Set<Handler<SceneEventName>>>();

/** Subscribe to a scene event. Returns an unsubscribe function. */
export function onSceneEvent<E extends SceneEventName>(
  event: E,
  handler: Handler<E>,
): () => void {
  const set = handlers.get(event) ?? new Set();
  set.add(handler as Handler<SceneEventName>);
  handlers.set(event, set);
  return () => {
    set.delete(handler as Handler<SceneEventName>);
  };
}

/** Emit a scene event to every subscriber. */
export function emitSceneEvent<E extends SceneEventName>(
  event: E,
  payload: SceneEventMap[E],
): void {
  const set = handlers.get(event);
  if (!set) return;
  for (const handler of set) {
    (handler as Handler<E>)(payload);
  }
}
