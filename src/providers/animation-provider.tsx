"use client";

import { createContext, useContext, useEffect } from "react";
import gsap from "gsap";
import { initMotion } from "@/systems/motion/motion.config";
import { scaledDuration } from "@/systems/motion/motion.utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const AnimationContext = createContext<{ reducedMotion: boolean }>({
  reducedMotion: false,
});

/** Shared animation context — currently just the live reduced-motion flag. */
export function useAnimationContext() {
  return useContext(AnimationContext);
}

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    initMotion();
  }, []);

  useEffect(() => {
    // Reduced motion: collapse the default tween duration to 0 so animations
    // land on their end state instantly instead of being skipped outright
    // (keeps layout/visibility logic that lives inside tweens correct).
    gsap.defaults({ duration: scaledDuration("base", reducedMotion) });
  }, [reducedMotion]);

  return (
    <AnimationContext.Provider value={{ reducedMotion }}>
      {children}
    </AnimationContext.Provider>
  );
}
