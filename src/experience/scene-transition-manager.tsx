"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useExperience } from "@/providers/experience-context";
import { useAnimationContext } from "@/providers/animation-provider";
import { getSceneTransitionTiming } from "@/systems/experience/transition.engine";

/**
 * Generic, scene-agnostic crossfade triggered whenever the active scene
 * changes. Doesn't know what a scene contains — only that it changed.
 * Individual scenes can still have their own internal animations; this
 * only owns the transition *between* scenes.
 */
export function SceneTransitionManager({ children }: { children: ReactNode }) {
  const { activeSceneId, setTransitionPhase } = useExperience();
  const { reducedMotion } = useAnimationContext();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    if (reducedMotion) {
      gsap.set(containerRef.current, { opacity: 1 });
      setTransitionPhase("idle");
      return;
    }

    setTransitionPhase("entering");
    const { duration, ease } = getSceneTransitionTiming();
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration,
        ease,
        onComplete: () => setTransitionPhase("idle"),
      },
    );
  }, [activeSceneId, reducedMotion]);

  return (
    <div ref={containerRef} data-scene-id={activeSceneId ?? undefined}>
      {children}
    </div>
  );
}
