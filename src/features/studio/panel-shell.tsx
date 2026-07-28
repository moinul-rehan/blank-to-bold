"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Button } from "@/components/primitives/button";
import { Text } from "@/components/primitives/text";
import { Heading } from "@/components/primitives/heading";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type PanelShellProps = {
  eyebrow: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * The shared chrome every object's destination opens into — a museum-
 * placard-style header, a close control that hands back to the room (the
 * camera zoom-out is driven by `useRoomCamera`, this only asks for it), and
 * a consistent entrance so no destination feels bolted-on.
 */
export function PanelShell({ eyebrow, title, onClose, children }: PanelShellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: reducedMotion ? 0 : 16 },
      { opacity: 1, y: 0, duration: reducedMotion ? 0 : 0.6, ease: "power2.out", delay: 0.15 },
    );
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className="border-border bg-background/95 fixed inset-4 z-[var(--z-modal)] overflow-y-auto rounded-lg border shadow-2xl sm:inset-10 lg:inset-16"
      style={{ backdropFilter: "blur(24px)" }}
    >
      <Section className="min-h-full px-[var(--layout-gutter)] py-16">
        <Container maxWidth="42rem" className="w-full">
          <div className="mb-12 flex items-start justify-between gap-6">
            <div>
              <Text
                as="p"
                className="text-muted-foreground font-mono text-xs tracking-[0.2em] uppercase"
              >
                {eyebrow}
              </Text>
              <Heading
                level={2}
                className="mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] font-medium tracking-tight text-balance"
              >
                {title}
              </Heading>
            </div>
            <Button
              onClick={onClose}
              data-cursor="interactive"
              aria-label="Back to the room"
              className="border-border hover:border-foreground shrink-0 rounded-full border px-5 py-2.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors"
            >
              ← Room
            </Button>
          </div>
          {children}
        </Container>
      </Section>
    </div>
  );
}
