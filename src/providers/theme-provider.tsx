"use client";

import { useEffect } from "react";
import { useThemeStore, type Theme } from "@/stores/theme-store";
import { applyTheme, subscribeSystemTheme } from "@/systems/theme/theme.engine";

const STORAGE_KEY = "b2b-theme";

/**
 * Blocking script injected before hydration so the correct theme class is
 * present on first paint — avoids a light/dark flash. Runs outside React,
 * before any module has loaded, so it can't import theme.engine.ts and
 * necessarily re-states that logic as a standalone string.
 */
export function ThemeScript() {
  const script = `
    (function () {
      try {
        var theme = localStorage.getItem("${STORAGE_KEY}") || "system";
        var isDark =
          theme === "dark" ||
          (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);
        document.documentElement.classList.toggle("dark", isDark);
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored) useThemeStore.setState({ theme: stored });
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);

    if (theme !== "system") return;
    return subscribeSystemTheme(() => applyTheme("system"));
  }, [theme]);

  return <>{children}</>;
}

export { useThemeStore } from "@/stores/theme-store";
