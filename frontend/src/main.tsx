import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";
import AppProvider from "./providers/AppProvider";

// アプリ全体で利用するライブラリのProviderの設定を行う
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <CssBaseline />
      <App />
    </AppProvider>
  </React.StrictMode>
);
