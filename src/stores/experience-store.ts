import { create } from "zustand";
import type { SceneId } from "@/systems/experience/scene.types";
import {
  canTransition,
  type SceneLifecycleState,
} from "@/systems/experience/scene-lifecycle";
import { emitSceneEvent } from "@/systems/experience/scene-events";

type ExperienceState = {
  sceneIds: SceneId[];
  activeSceneId: SceneId | null;
  previousSceneId: SceneId | null;
  lifecycle: SceneLifecycleState;
  /** Whether the initial entry into the experience has happened. */
  hasEntered: boolean;

  registerScenes: (sceneIds: SceneId[], initialSceneId?: SceneId) => void;
  goToScene: (id: SceneId) => void;
  setLifecycle: (state: SceneLifecycleState) => void;
  markEntered: () => void;
};

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  sceneIds: [],
  activeSceneId: null,
  previousSceneId: null,
  lifecycle: "idle",
  hasEntered: false,

  registerScenes: (sceneIds, initialSceneId) =>
    set((state) => ({
      sceneIds,
      activeSceneId:
        state.activeSceneId ?? initialSceneId ?? sceneIds[0] ?? null,
    })),

  goToScene: (id) => {
    const { sceneIds, activeSceneId } = get();
    if (!sceneIds.includes(id) || id === activeSceneId) return;
    set({ previousSceneId: activeSceneId, activeSceneId: id });
    emitSceneEvent("scene:change", { from: activeSceneId, to: id });
  },

  /** Guarded by the lifecycle state machine — illegal transitions are ignored. */
  setLifecycle: (next) => {
    if (!canTransition(get().lifecycle, next)) return;
    set({ lifecycle: next });
  },

  markEntered: () => set({ hasEntered: true }),
}));
