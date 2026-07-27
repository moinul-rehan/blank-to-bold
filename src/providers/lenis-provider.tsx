"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type RefObject,
} from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/**
 * A ref to the active Lenis instance (null when smooth scroll is disabled
 * via reduced motion, or before mount). Imperative by design — read
 * `.current` inside event handlers/effects, not during render.
 */
export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const instance = new Lenis({ autoRaf: false });
    lenisRef.current = instance;

    const onTick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
