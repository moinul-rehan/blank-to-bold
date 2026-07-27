"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useExperience } from "@/providers/experience-context";
import { useAnimationContext } from "@/providers/animation-provider";
import {
  resolveSceneTransition,
  TRANSITION_TO,
} from "@/systems/experience/transition.engine";
import { emitSceneEvent } from "@/systems/experience/scene-events";

/**
 * Runs the transition *between* scenes, using whatever the incoming scene
 * declared. Knows nothing about scene contents — a scene's own internal
 * choreography is its `enterAnimation`, handled by the scene itself.
 *
 * Known gap: exit choreography (`exitAnimation`) isn't run yet — animating
 * an outgoing scene requires keeping it mounted while the next one loads,
 * which isn't built. `scene:exit-start` is emitted so subscribers can
 * already react; the visual half is deliberately deferred until real
 * scenes exist to test it against.
 */
export function SceneTransitionManager({ children }: { children: ReactNode }) {
  const { activeScene, activeSceneId, previousSceneId, setLifecycle } =
    useExperience();
  const { reducedMotion } = useAnimationContext();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !activeScene) return;

    if (previousSceneId) {
      emitSceneEvent("scene:exit-start", { sceneId: previousSceneId });
      emitSceneEvent("scene:exit-complete", { sceneId: previousSceneId });
    }

    const settle = () => {
      emitSceneEvent("scene:enter-complete", { sceneId: activeScene.id });
      setLifecycle("active");
    };

    if (reducedMotion || activeScene.transition.type === "none") {
      gsap.set(containerRef.current, TRANSITION_TO);
      settle();
      return;
    }

    emitSceneEvent("scene:enter-start", { sceneId: activeScene.id });
    const { from, duration, ease } = resolveSceneTransition(
      activeScene.transition,
    );
    gsap.fromTo(containerRef.current, from, {
      ...TRANSITION_TO,
      duration,
      ease,
      onComplete: settle,
    });
  }, [activeSceneId, reducedMotion]);

  return (
    <div ref={containerRef} data-scene-id={activeSceneId ?? undefined}>
      {children}
    </div>
  );
}
