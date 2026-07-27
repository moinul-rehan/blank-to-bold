import { create } from "zustand";
import type {
  SceneId,
  TransitionPhase,
} from "@/systems/experience/experience.types";

type ExperienceState = {
  sceneIds: SceneId[];
  activeSceneId: SceneId | null;
  previousSceneId: SceneId | null;
  transitionPhase: TransitionPhase;
  /** Whether the initial entry into the experience has happened. */
  hasEntered: boolean;

  registerScenes: (sceneIds: SceneId[], initialSceneId?: SceneId) => void;
  goToScene: (id: SceneId) => void;
  setTransitionPhase: (phase: TransitionPhase) => void;
  markEntered: () => void;
};

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  sceneIds: [],
  activeSceneId: null,
  previousSceneId: null,
  transitionPhase: "idle",
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
  },

  setTransitionPhase: (phase) => set({ transitionPhase: phase }),

  markEntered: () => set({ hasEntered: true }),
}));
