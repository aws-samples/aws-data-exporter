import { createTheme, ThemeProvider } from "@mui/material";
import React, { ReactNode, useMemo } from "react";
import useLocale from "../hooks/useLocale";
import useMuiTheme from "../hooks/useMuiTheme";

const MuiThemeProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { themeMode } = useMuiTheme();
  const { muiLocale } = useLocale();

  const theme = useMemo(() => {
    return createTheme(
      {
        palette: {
          mode: themeMode,
        },
      },
      muiLocale ?? {}
    );
  }, [themeMode, muiLocale]);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MuiThemeProvider;
