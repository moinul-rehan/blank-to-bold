import type { SceneId } from "@/systems/experience/experience.types";

/** The scene after `currentId` in the registered order, or null at the end. */
export function getNextSceneId(
  sceneIds: SceneId[],
  currentId: SceneId | null,
): SceneId | null {
  if (sceneIds.length === 0) return null;
  const index = currentId ? sceneIds.indexOf(currentId) : -1;
  const nextIndex = index + 1;
  return nextIndex < sceneIds.length ? sceneIds[nextIndex] : null;
}

/** The scene before `currentId` in the registered order, or null at the start. */
export function getPreviousSceneId(
  sceneIds: SceneId[],
  currentId: SceneId | null,
): SceneId | null {
  if (sceneIds.length === 0) return null;
  const index = currentId ? sceneIds.indexOf(currentId) : -1;
  const previousIndex = index - 1;
  return previousIndex >= 0 ? sceneIds[previousIndex] : null;
}
