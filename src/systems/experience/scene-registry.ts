import type {
  SceneDefinition,
  SceneId,
} from "@/systems/experience/scene.types";
import {
  getNextSceneId,
  getPreviousSceneId,
} from "@/systems/experience/scene-manager.engine";

export type SceneRegistry = {
  /** Scene definitions, sorted by `order`. */
  scenes: SceneDefinition[];
  /** Scene ids in `order` — the canonical sequence of the experience. */
  ids: SceneId[];
  get: (id: SceneId) => SceneDefinition | undefined;
  getByRoute: (route: string) => SceneDefinition | undefined;
  next: (id: SceneId | null) => SceneId | null;
  previous: (id: SceneId | null) => SceneId | null;
};

/**
 * Builds the registry from scene definitions. Sorting is by `order`, not
 * array position, so scenes can be declared in any order and reordered by
 * changing one number.
 */
export function createSceneRegistry(
  definitions: SceneDefinition[],
): SceneRegistry {
  const seen = new Set<SceneId>();
  for (const definition of definitions) {
    if (seen.has(definition.id)) {
      // Worth failing loudly: a duplicate id silently makes one scene
      // unreachable rather than producing an obvious error.
      throw new Error(`Duplicate scene id in registry: "${definition.id}"`);
    }
    seen.add(definition.id);
  }

  const scenes = [...definitions].sort((a, b) => a.order - b.order);
  const ids = scenes.map((scene) => scene.id);
  const byId = new Map(scenes.map((scene) => [scene.id, scene]));

  return {
    scenes,
    ids,
    get: (id) => byId.get(id),
    getByRoute: (route) => scenes.find((scene) => scene.route === route),
    next: (id) => getNextSceneId(ids, id),
    previous: (id) => getPreviousSceneId(ids, id),
  };
}
