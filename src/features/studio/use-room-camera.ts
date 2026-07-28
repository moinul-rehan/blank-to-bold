import { useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type RoomCameraTarget = { x: number; y: number };

const FOCUS_SCALE = 2.3;

/**
 * The room's "camera" — not a real 3D camera, a scale+translate trick on
 * the whole stage. `transformOrigin` stays fixed at the stage's own center
 * (never per-target) — an earlier version pointed it at the target's x/y
 * instead, which zooms *around* that point but leaves it wherever it
 * already was on screen, not necessarily centered. Centering any target
 * point needs an explicit counter-translate alongside the scale: with
 * origin fixed at center, `xPercent`/`yPercent` (resolved against the
 * stage's own untransformed size, same convention as CSS's own
 * `translate(%)` and unaffected by `scale` — GSAP applies translate in
 * final screen-space, not pre-scale local space) computed as
 * `-scale * (target% - 50)` moves the target point to exactly (50%, 50%)
 * for any scale. Under reduced motion the move still happens (it's the
 * actual navigation, not decoration) but instantly, no tween.
 */
export function useRoomCamera(stageRef: RefObject<HTMLDivElement | null>) {
  const [focusId, setFocusId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const focus = (id: string, target: RoomCameraTarget) => {
    const stage = stageRef.current;
    if (!stage) return;
    setFocusId(id);
    gsap.set(stage, { transformOrigin: "50% 50%" });
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(stage, {
      scale: FOCUS_SCALE,
      xPercent: -FOCUS_SCALE * (target.x - 50),
      yPercent: -FOCUS_SCALE * (target.y - 50),
      filter: "saturate(0.7) brightness(0.65) blur(1.5px)",
      duration: reducedMotion ? 0 : 1.1,
      ease: "power3.inOut",
    });
  };

  const blur = () => {
    const stage = stageRef.current;
    if (!stage) return;
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(stage, {
      scale: 1,
      xPercent: 0,
      yPercent: 0,
      filter: "saturate(1) brightness(1) blur(0px)",
      duration: reducedMotion ? 0 : 0.9,
      ease: "power3.inOut",
      onComplete: () => setFocusId(null),
    });
  };

  return { focusId, focus, blur };
}
