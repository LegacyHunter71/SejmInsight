import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  // 1. Pobieramy zapisany motyw z localStorage lub domyślnie ustawiamy 'system'
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      // 2. Jeśli użytkownik wybrał konkretny motyw
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        // 3. Jeśli wybrano 'system', sprawdzamy media query systemu operacyjnego
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        if (systemPrefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    applyTheme();
    localStorage.setItem("theme", theme);

    // 4. KLUCZOWE: Jeśli wybrano tryb systemowy, musimy nasłuchiwać zmian w locie
    // (np. gdy system automatycznie zmienia motyw o zachodzie słońca)
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      // Definiujemy funkcję reagującą na zmianę w systemie
      const handleSystemThemeChange = () => {
        if (mediaQuery.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };

      mediaQuery.addEventListener("change", handleSystemThemeChange);

      // Sprzątamy listener przy unmouncie komponentu lub zmianie wyboru
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, [theme]);

  return { theme, setTheme };
}
