"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useAnimationContext } from "@/providers/animation-provider";
import { getDuration, getEase } from "@/systems/motion/motion.tokens";
import { cn } from "@/lib/utils";

/**
 * The landing "Door" — the first screen a visitor sees. Starts blank
 * (monochrome), turns bold (accent color) shortly after — dramatizing the
 * project name itself as the entry point's one animation, rather than
 * motion for its own sake.
 */
export function Door() {
  const { reducedMotion } = useAnimationContext();
  const [isBold, setIsBold] = useState(reducedMotion);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => setIsBold(true), getDuration("base") * 1000);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  useGSAP(() => {
    if (reducedMotion || !cueRef.current) return;
    gsap.to(cueRef.current, {
      y: 8,
      duration: getDuration("slow"),
      ease: getEase("standard"),
      repeat: -1,
      yoyo: true,
    });
  }, [reducedMotion]);

  return (
    <section className="flex min-h-[calc(100svh-var(--layout-header-height))] flex-col items-center justify-center px-[var(--layout-gutter)] text-center">
      <p className="text-muted-foreground mb-4 text-sm font-medium tracking-wide uppercase">
        Rehan — Product Designer
      </p>
      <h1 className="max-w-3xl text-5xl leading-tight font-semibold tracking-tight sm:text-7xl">
        Blank to{" "}
        <span
          className={cn(
            "duration-slow ease-emphasized transition-colors",
            isBold ? "text-primary" : "text-foreground",
          )}
        >
          Bold
        </span>
        .
      </h1>
      <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">
        I want you to experience how I think as a product designer — not just
        view the work I&apos;ve created.
      </p>
      <div
        ref={cueRef}
        className="text-muted-foreground mt-16 text-xs font-medium tracking-widest uppercase"
      >
        Scroll to explore
      </div>
    </section>
  );
}
