import { AmplifyProvider } from "@aws-amplify/ui-react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "../i18n";
import AlertSnackbarProvider from "./AlertSnackbarProvider";
import LoadingProvider from "./LoadingProvider";
import MuiThemeProvider from "./MuiThemeProvider";

const AppProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { i18n } = useTranslation();
  return (
    <RecoilRoot>
      <AmplifyProvider colorMode="system">
        <MuiThemeProvider>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={i18n.language}
          >
            <BrowserRouter>
              <AlertSnackbarProvider>
                <LoadingProvider>{children}</LoadingProvider>
              </AlertSnackbarProvider>
            </BrowserRouter>
          </LocalizationProvider>
        </MuiThemeProvider>
      </AmplifyProvider>
    </RecoilRoot>
  );
};

export default AppProvider;
