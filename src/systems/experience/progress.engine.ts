import type { SceneId } from "@/systems/experience/experience.types";

/** Progress through the experience as a 0–1 fraction, by scene position. */
export function calculateProgress(
  sceneIds: SceneId[],
  activeSceneId: SceneId | null,
): number {
  if (sceneIds.length === 0 || !activeSceneId) return 0;
  const index = sceneIds.indexOf(activeSceneId);
  if (index === -1) return 0;
  if (sceneIds.length === 1) return 1;
  return index / (sceneIds.length - 1);
}
