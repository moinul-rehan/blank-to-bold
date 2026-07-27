"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getPointerType,
  subscribePointerType,
} from "@/systems/interaction/interaction.engine";
import { resolveCursorVariant } from "@/systems/cursor/cursor.engine";
import { useCursorStore } from "@/stores/cursor-store";

const CursorEnabledContext = createContext(false);

/**
 * Whether a custom cursor should render at all — false on touch/coarse
 * pointers, where there's no cursor to replace.
 */
export function useCursorEnabled() {
  return useContext(CursorEnabledContext);
}

export { useCursorStore } from "@/stores/cursor-store";

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(() => getPointerType() === "fine");

  useEffect(() => {
    return subscribePointerType((pointerType) =>
      setEnabled(pointerType === "fine"),
    );
  }, []);

  useEffect(() => {
    if (!enabled) {
      useCursorStore.setState({ variant: "default" });
      return;
    }

    const onPointerOver = (event: PointerEvent) => {
      const variant = resolveCursorVariant(event.target as Element | null);
      useCursorStore.setState({ variant });
    };
    document.addEventListener("pointerover", onPointerOver);
    return () => document.removeEventListener("pointerover", onPointerOver);
  }, [enabled]);

  return (
    <CursorEnabledContext.Provider value={enabled}>
      {children}
    </CursorEnabledContext.Provider>
  );
}
