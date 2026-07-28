import { useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type RoomCameraTarget = { x: number; y: number };

/**
 * The room's "camera" — not a real 3D camera, a scale+transform-origin trick
 * on the whole stage. Setting `transformOrigin` to the target object's
 * position, then scaling up, reads as the camera dollying toward that point.
 * Under reduced motion the move still happens (it's the actual navigation,
 * not decoration) but instantly, no tween.
 */
export function useRoomCamera(stageRef: RefObject<HTMLDivElement | null>) {
  const [focusId, setFocusId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const focus = (id: string, target: RoomCameraTarget) => {
    const stage = stageRef.current;
    if (!stage) return;
    setFocusId(id);
    gsap.set(stage, { transformOrigin: `${target.x}% ${target.y}%` });
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(stage, {
      scale: 2.3,
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
      filter: "saturate(1) brightness(1) blur(0px)",
      duration: reducedMotion ? 0 : 0.9,
      ease: "power3.inOut",
      onComplete: () => setFocusId(null),
    });
  };

  return { focusId, focus, blur };
}
