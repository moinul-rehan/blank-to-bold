"use client";

import {
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
} from "react";
import Image from "next/image";
import {
  useRoomCamera,
  type RoomCameraTarget,
} from "@/features/studio/use-room-camera";
import { useThemeStore } from "@/stores/theme-store";
import { Hotspot } from "@/features/studio/hotspot";
import { DeskModel3D } from "@/features/studio/desk-model-3d";
import { BookshelfModel3D } from "@/features/studio/bookshelf-model-3d";
import {
  AboutPanel,
  ProjectsPanel,
  ProcessPanel,
  JournalPanel,
  ExperimentsPanel,
  LearningPanel,
  HiddenPlaygroundPanel,
  FutureVisionPanel,
  RandomFactsPanel,
  SystemsThinkingPanel,
} from "@/features/studio/room-panels";

const PANELS: Record<string, ComponentType<{ onClose: () => void }>> = {
  "photo-frame": AboutPanel,
  monitor: ProjectsPanel,
  sketchbook: ProcessPanel,
  notebook: JournalPanel,
  "sticky-notes": ExperimentsPanel,
  bookshelf: LearningPanel,
  drawer: HiddenPlaygroundPanel,
  window: FutureVisionPanel,
  mug: RandomFactsPanel,
  whiteboard: SystemsThinkingPanel,
};

/**
 * Each entry: id, camera-focus target (%), hotspot label position (%, can
 * differ slightly from the focus target for readability), and which side
 * the label card opens toward.
 */
const HOTSPOTS: {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  align?: "left" | "right";
}[] = [
  {
    id: "window",
    title: "Future Vision",
    subtitle: "Where this is heading",
    x: 16,
    y: 34,
  },
  {
    id: "whiteboard",
    title: "Systems Thinking",
    subtitle: "Architecture & flows",
    x: 42,
    y: 20,
  },
  {
    id: "photo-frame",
    title: "About",
    subtitle: "Get to know Rehan",
    x: 58,
    y: 22,
  },
  {
    id: "sticky-notes",
    title: "Playground",
    subtitle: "Quick experiments",
    x: 90,
    y: 28,
    align: "right",
  },
  {
    id: "bookshelf",
    title: "Learning Journey",
    subtitle: "Books & timeline",
    x: 90,
    y: 48,
    align: "right",
  },
  {
    id: "sketchbook",
    title: "Process",
    subtitle: "How thinking becomes design",
    x: 32,
    y: 75,
  },
  {
    id: "notebook",
    title: "Journal",
    subtitle: "Thoughts, lessons, growth",
    x: 40,
    y: 80,
  },
  {
    id: "monitor",
    title: "Selected Work",
    subtitle: "Explore my projects",
    x: 50,
    y: 58,
  },
  {
    id: "mug",
    title: "Random Facts",
    subtitle: "Small personal details",
    x: 66,
    y: 72,
  },
  {
    id: "drawer",
    title: "Hidden Playground",
    subtitle: "Unreleased concepts",
    x: 58,
    y: 86,
  },
];

/** Watches the `.dark` class ThemeProvider toggles — real reactivity plus a matching server/client snapshot, avoiding the hydration-mismatch class of bug hit earlier with the Cursor System. */
function subscribeDarkClass(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

/**
 * The room itself — a photographed-studio background (day/night pair) with
 * a composited desk image and, until each object has its own asset, dot
 * marker hotspots for navigation. The "camera" is a scale + transform-origin
 * trick on the whole stage (`useRoomCamera`), not a real 3D camera.
 */
export function RoomStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const { focusId, focus, blur } = useRoomCamera(stageRef);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const isDark = useSyncExternalStore(
    subscribeDarkClass,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
  const lit = !isDark;

  const activate = (id: string, target: RoomCameraTarget) => {
    focus(id, target);
    setActivePanel(id);
  };

  const close = () => {
    setActivePanel(null);
    blur();
  };

  const toggleLamp = () => {
    useThemeStore.getState().setTheme(lit ? "dark" : "light");
  };

  const ActivePanelComponent = activePanel ? PANELS[activePanel] : null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div
        ref={stageRef}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Room background — day/night crossfade drives both the visual mood and the lamp state. */}
        <Image
          src="/Studio/Studio-room-day.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover transition-opacity duration-[900ms] ease-in-out"
          style={{ opacity: lit ? 1 : 0 }}
        />
        <Image
          src="/Studio/Studio-room-night.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover transition-opacity duration-[900ms] ease-in-out"
          style={{ opacity: lit ? 0 : 1 }}
        />

        {/* Desk — a real 3D model (see desk-model-3d.tsx for why), not a flat image like the rest of the room.
            Position (this box) has gone through several rounds of "move back toward the wall" tuning —
            see git history for the blow-by-blow. Sized up ~22% (width/height, re-centered) per feedback
            that the desk/monitor read too small for the room — this is the right lever for on-screen size:
            desk-model-3d.tsx's TARGET_SIZE is deliberately camera-compensated (see SCALE_RATIO there) so
            changing it alone doesn't change how big the model looks, only this box's footprint does.
            Height increased further (bottom held fixed, so it only grows upward) per feedback that the
            model was cutting off at the top. Paired with a wider camera FOV in desk-model-3d.tsx — FOV is
            *vertical* and fixed regardless of container size, so a taller box alone doesn't necessarily
            reveal more content; both were adjusted together as a hedge, since which one actually mattered
            couldn't be visually confirmed this round (no browser/screenshot tool available). Check against
            a fresh screenshot before nudging further. */}
        <div
          className="absolute"
          style={{ left: "20.5%", width: "60%", bottom: "14%", height: "45%" }}
        >
          <DeskModel3D />
        </div>

        {/* Bookshelf — a real 3D model (bookcase.glb), composited the same way as the desk above.
            Moved right per an annotated screenshot showing it sitting inside/overlapping the window
            glass instead of the open floor gap before the desk (box starts at left=20.5%) — narrowed
            slightly too, to stay clear of the desk's box at the new position. Still a visually-informed
            estimate, not a pixel-precise one (no browser/screenshot tool available this round to render
            and re-check) — check against a fresh screenshot before nudging further. */}
        <div
          className="absolute"
          style={{ left: "9%", width: "12%", bottom: "14%", height: "50%" }}
        >
          <BookshelfModel3D />
        </div>

        {/* Lamp toggle — no lamp asset yet, so this is its own control rather than a Hotspot (it changes the whole room, not just itself). */}
        <button
          type="button"
          onClick={toggleLamp}
          data-cursor="interactive"
          aria-label="Toggle the room's lighting (light / dark)"
          className="group absolute -translate-x-1/2 -translate-y-1/2 border-0 bg-transparent p-0"
          style={{ left: "72%", top: "62%" }}
        >
          <span
            aria-hidden
            className="bg-primary block size-3 rounded-full shadow-[0_0_0_4px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-125"
          />
          <span className="bg-background/90 border-border pointer-events-none absolute top-1/2 left-full ml-3 flex -translate-y-1/2 flex-col items-start gap-0.5 rounded-md border px-3 py-2 whitespace-nowrap opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <span className="text-foreground text-xs font-medium">
              Light / Dark
            </span>
            <span className="text-muted-foreground text-[0.65rem]">
              Change the mood
            </span>
          </span>
        </button>

        {HOTSPOTS.map((h) => (
          <Hotspot
            key={h.id}
            x={h.x}
            y={h.y}
            title={h.title}
            subtitle={h.subtitle}
            align={h.align}
            onActivate={() => activate(h.id, { x: h.x, y: h.y })}
          />
        ))}
      </div>

      {focusId && (
        <button
          type="button"
          onClick={close}
          aria-label="Zoom back out"
          className="absolute inset-0 z-[calc(var(--z-modal)-1)] cursor-zoom-out border-0 bg-transparent"
        />
      )}

      {ActivePanelComponent && <ActivePanelComponent onClose={close} />}
    </div>
  );
}
