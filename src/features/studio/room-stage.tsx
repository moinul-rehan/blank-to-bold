"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
} from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  useRoomCamera,
  type RoomCameraTarget,
} from "@/features/studio/use-room-camera";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useThemeStore } from "@/stores/theme-store";
import { Hotspot } from "@/features/studio/hotspot";
import { DeskModel3D } from "@/features/studio/desk-model-3d";
import { BookshelfModel3D } from "@/features/studio/bookshelf-model-3d";
import { WallBoard } from "@/features/studio/wall-board";
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
};

/**
 * Objects whose own composited visual IS the content once the camera
 * reaches them — no separate PanelShell overlay stacked on top (per the
 * master spec: "the object is the entrance to the content," not a
 * placeholder that hands off to a generic card). Currently just the wall
 * board: zooming in on it, centered and enlarged, already shows every
 * sticky note — a modal on top of that would just cover it back up.
 * `room-panels.tsx`'s `SystemsThinkingPanel` still exists (unused here) in
 * case a deeper second layer gets wired to it later.
 */
const FOCUS_ONLY_IDS = new Set(["whiteboard"]);

// Must match WallBoard's own left/top (wall-board.tsx).
const BOARD_X = 66;
const BOARD_Y = 35;
// The board starts at only 7.5% of the stage's width — the stage's generic
// FOCUS_SCALE (2.3x, tuned for the room overall) barely enlarges something
// that small. This is board-specific so it can end up around half the
// viewport width when focused, independent of the backdrop's own zoom.
const BOARD_FOCUS_SCALE = 7.3;

/**
 * Each entry: id, camera-focus target (%), and the invisible hotspot's
 * position (%, can differ slightly from the focus target for readability).
 * `subtitle` isn't rendered anywhere yet — it documents each object's
 * narrative role ("why is this object here") ahead of the content-reveal
 * work described in the master experience spec, not dead data.
 */
const HOTSPOTS: {
  id: string;
  title: string;
  subtitle: string;
  x: number;
  y: number;
}[] = [
  {
    id: "window",
    title: "Future Vision",
    subtitle: "Where this is heading",
    x: 16,
    y: 34,
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
  },
  {
    id: "bookshelf",
    title: "Learning Journey",
    subtitle: "Books & timeline",
    x: 90,
    y: 48,
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
    // Computed, not guessed: the monitor is a real 3D object inside its
    // own camera (desk-model-3d.tsx), so its on-screen position is
    // derivable from that camera's math rather than eyeballed. Projected
    // the monitor's position (MONITOR_X, 1.7, 0.5) through that Canvas's
    // camera (position, lookAt, 36° vertical FOV) to get where its screen
    // lands within the desk's own box (~42%, ~17% of the desk canvas),
    // then mapped that into this room-stage's coordinates via the desk
    // box's own left/width/bottom/height (24/60/14/45). One real
    // assumption baked in: the desk canvas's on-screen aspect ratio
    // (guessed ~2.2, since it depends on the actual viewport, not a fixed
    // number) — affects the horizontal estimate more than the vertical
    // one. Replaces the old (50, 58) eyeballed guess, which sat visibly
    // low relative to where this math puts the monitor (Y=1.7 is well
    // above the camera's own look-at height of 0.77, so the screen should
    // read notably higher in frame). Not visually confirmed.
    x: 49,
    y: 49,
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
 * composited objects and, until every object has its own asset, invisible
 * hotspots for the rest. The "camera" is a scale + counter-translate trick
 * on the whole stage (`useRoomCamera`), not a real 3D camera — but it does
 * bring the clicked target to the exact center of the screen, same as a
 * real dolly-and-frame would.
 */
export function RoomStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLButtonElement>(null);
  const { focusId, focus, blur } = useRoomCamera(stageRef);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const isDark = useSyncExternalStore(
    subscribeDarkClass,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
  const lit = !isDark;

  const activate = (id: string, target: RoomCameraTarget) => {
    focus(id, target);
    if (!FOCUS_ONLY_IDS.has(id)) setActivePanel(id);
  };

  const close = useCallback(() => {
    setActivePanel(null);
    blur();
  }, [blur]);

  // ESC always returns smoothly to the master camera (`blur()` is the same
  // GSAP tween the "Zoom back out" backdrop and the panel's "← Room" button
  // use) — never an instant close, per the master experience spec.
  useEffect(() => {
    if (!focusId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusId, close]);

  // The board's own zoom, independent of (but synced in timing/easing with)
  // the backdrop's blur/dim tween in useRoomCamera — see wall-board.tsx for
  // why it needs to live outside the filtered stage. `xPercent`/`yPercent`
  // stay fixed at -50 (the board's own self-centering, since it no longer
  // uses the CSS translate utility other room elements use); `x`/`y` are
  // real pixel offsets (measured against the shared container) that move
  // the board's anchor point from its resting (66%, 35%) position to the
  // container's exact center — scale-independent, since scaling the board
  // around its own center never displaces that center (unlike the
  // stage-wide zoom, which needs a scale-multiplied offset instead).
  useEffect(() => {
    const el = boardRef.current;
    const container = containerRef.current;
    if (!el || !container) return;
    const focused = focusId === "whiteboard";
    const rect = container.getBoundingClientRect();
    const dx = ((50 - BOARD_X) / 100) * rect.width;
    const dy = ((50 - BOARD_Y) / 100) * rect.height;
    gsap.to(el, {
      xPercent: -50,
      yPercent: -50,
      x: focused ? dx : 0,
      y: focused ? dy : 0,
      scale: focused ? BOARD_FOCUS_SCALE : 1,
      duration: reducedMotion ? 0 : focused ? 1.1 : 0.9,
      ease: "power3.inOut",
    });
  }, [focusId, reducedMotion]);

  const toggleLamp = () => {
    useThemeStore.getState().setTheme(lit ? "dark" : "light");
  };

  const ActivePanelComponent = activePanel ? PANELS[activePanel] : null;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-black"
    >
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
            couldn't be visually confirmed this round (no browser/screenshot tool available). `left` nudged
            slightly right (desk + monitor move together, same canvas) — width/bottom/height untouched, so
            scale and floor alignment stay exactly as already tuned. */}
        <div
          className="absolute"
          style={{ left: "24%", width: "60%", bottom: "14%", height: "45%" }}
        >
          <DeskModel3D />
        </div>

        {/* Bookshelf — a real 3D model (bookcase.glb), composited the same way as the desk above.
            Left/width (26%/12%) confirmed correct — matches the "Process" hotspot's x position (32,
            centered: 32 − 6). `bottom` dropped from 25% to 14% — same floor-line value already tuned for
            the desk's box below — per feedback that it was floating above the floor instead of touching
            it. Not re-checked visually this round (no browser/screenshot tool available). */}
        <div
          className="absolute"
          style={{ left: "26%", width: "12%", bottom: "14%", height: "50%" }}
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
            onActivate={() => activate(h.id, { x: h.x, y: h.y })}
          />
        ))}
      </div>

      {/* Wall board with sticky notes — rendered outside the stage above, not
          inside it: see wall-board.tsx for why (needs to stay sharp while the
          stage blurs/dims). Its own hover mechanic replaces a separate
          Hotspot, matching "swap for the real object's own hover mechanic
          once it has an asset." Focus target (BOARD_X, BOARD_Y) matches the
          board's own resting position — keep them in sync if it moves again. */}
      <WallBoard
        ref={boardRef}
        onActivate={() => activate("whiteboard", { x: BOARD_X, y: BOARD_Y })}
      />

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
