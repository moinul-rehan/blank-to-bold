import type { ReactNode } from "react";
import { BackgroundLayer } from "@/experience/layout/background-layer";
import { ContentLayer } from "@/experience/layout/content-layer";
import { TransitionLayer } from "@/experience/layout/transition-layer";
import { NavigationLayer } from "@/experience/layout/navigation-layer";
import { EffectLayer } from "@/experience/layout/effect-layer";
import { CursorLayer } from "@/experience/layout/cursor-layer";
import { SoundLayer } from "@/experience/layout/sound-layer";
import { DebugLayer } from "@/experience/layout/debug-layer";
import { OverlayLayer } from "@/experience/overlay-layer";

export type GlobalLayoutProps = {
  /** Goes into the Content Layer. */
  children: ReactNode;
  background?: ReactNode;
  navigation?: ReactNode;
  overlay?: ReactNode;
  effect?: ReactNode;
  cursor?: ReactNode;
  sound?: ReactNode;
  debug?: ReactNode;
};

/**
 * The site's fundamental visual architecture: nine isolated, stacked
 * layers, each its own component, each usable on its own. This composes
 * them in the correct order but has no opinion on what any of them
 * contain — every slot is empty unless a caller supplies content.
 *
 * Responsive by construction: every fixed layer uses `inset-0` (stretches
 * to the viewport at any size, no hardcoded dimensions); Content is the
 * one layer in normal document flow, so it grows/scrolls naturally.
 */
export function GlobalLayout({
  children,
  background,
  navigation,
  overlay,
  effect,
  cursor,
  sound,
  debug,
}: GlobalLayoutProps) {
  return (
    <>
      <BackgroundLayer>{background}</BackgroundLayer>
      <TransitionLayer>
        <ContentLayer>{children}</ContentLayer>
      </TransitionLayer>
      <NavigationLayer>{navigation}</NavigationLayer>
      <OverlayLayer>{overlay}</OverlayLayer>
      <EffectLayer>{effect}</EffectLayer>
      <CursorLayer>{cursor}</CursorLayer>
      <SoundLayer>{sound}</SoundLayer>
      <DebugLayer>{debug}</DebugLayer>
    </>
  );
}
