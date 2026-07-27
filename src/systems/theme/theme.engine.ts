import type { Theme } from "@/systems/theme/theme.types";

const DARK_QUERY = "(prefers-color-scheme: dark)";

/** Resolves `"system"` to the OS/browser's actual current preference. */
export function resolveSystemTheme(): "light" | "dark" {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function isDark(theme: Theme): boolean {
  return (
    theme === "dark" || (theme === "system" && resolveSystemTheme() === "dark")
  );
}

/** Applies `theme` by toggling the `.dark` class on the document root. */
export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", isDark(theme));
}

/** Notifies `callback` whenever the OS/browser color-scheme preference changes. */
export function subscribeSystemTheme(callback: () => void): () => void {
  const mediaQueryList = window.matchMedia(DARK_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}
