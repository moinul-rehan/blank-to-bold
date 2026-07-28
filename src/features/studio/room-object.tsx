"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type RoomObjectProps = {
  id: string;
  /** Position as a percentage of the stage, center-anchored. */
  x: number;
  y: number;
  /** Width as a percentage of the stage — height follows from the SVG's own viewBox. */
  width: number;
  /** 0–1, further-back objects are slightly smaller/duller/blurred — the depth illusion. */
  depth?: number;
  label: string;
  cursor?: "interactive" | "magnetic" | "hover";
  onActivate?: () => void;
  children: ReactNode;
};

/**
 * The one shared mechanic every room object gets: pointer-tilt, a soft lift,
 * and an ambient glow on hover — "every object individually interactive"
 * without each object re-implementing the same pointer math. Objects that
 * lead somewhere pass `onActivate`; purely ambient ones (a plant, a mug's
 * decorative twin) just omit it and still tilt/glow.
 */
export function RoomObject({
  id,
  x,
  y,
  width,
  depth = 1,
  label,
  cursor = "interactive",
  onActivate,
  children,
}: RoomObjectProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power2" });
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power2" });
    const lift = gsap.quickTo(el, "y", { duration: 0.4, ease: "power2" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      rotY(px * 12);
      rotX(-py * 12);
    };
    const onEnter = () => lift(-Math.max(4, depth * 8));
    const onLeave = () => {
      rotX(0);
      rotY(0);
      lift(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reducedMotion, depth]);

  return (
    <button
      ref={ref}
      id={`room-object-${id}`}
      type="button"
      data-cursor={cursor}
      onClick={onActivate}
      aria-label={label}
      className="group absolute -translate-x-1/2 -translate-y-1/2 border-0 bg-transparent p-0"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        transformStyle: "preserve-3d",
        filter: `brightness(${0.75 + depth * 0.25}) blur(${(1 - depth) * 1.2}px)`,
        zIndex: Math.round(depth * 100),
      }}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-30%] -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ background: "var(--primary)" }}
      />
    </button>
  );
}
