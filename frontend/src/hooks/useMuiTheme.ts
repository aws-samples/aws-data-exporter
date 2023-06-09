import { useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

type ThemeMode = "dark" | "light";
const themeModeState = atom<ThemeMode>({
  key: "themeMode",
  default: "light",
});

const KEY = "muiThemeMode";

/**
 * Hooks for MUI Theme
 *
 * @returns
 */
const useMuiTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Theme settings persist in LocalStrage.
  const savedTheme = localStorage.getItem(KEY) as ThemeMode | null;
  const [themeMode, setThemeMode] = useRecoilState(themeModeState);

  // If theme settings are not saved, set the theme according to the OS settings.
  useEffect(() => {
    setThemeMode(savedTheme ?? (prefersDarkMode ? "dark" : "light"));
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, themeMode ?? "light");
  }, [themeMode]);

  return {
    themeMode,
    isDark: themeMode === "dark",
    switchMode: () => {
      setThemeMode(themeMode === "light" ? "dark" : "light");
    },
  };
};

export default useMuiTheme;
