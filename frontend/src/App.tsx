import React, { lazy, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import RequiresAuth from "./features/auth/components/RequiresAuth";

const MyPage = lazy(() => import("./features/myPage/pages/MyPage"));
const Layout = lazy(() => import("./components/Layout"));
const ReportConditionsPage = lazy(
  () => import("./features/report/pages/ReportConditionsPage")
);
const ReportExtractPage = lazy(
  () => import("./features/report/pages/ReportExtractPage")
);

/**
 * Main page for Application
 * Implement routing, common process for application
 * @returns
 */
const App: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // set header title
    document.title = t("app.name");
  }, []);

  return (
    <Routes>
      {/* Pages that require authentication are set as child elements of RequiresAuth. */}
      <Route element={<RequiresAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<MyPage />} />
          <Route
            path="/report/conditions/:reportId"
            element={<ReportConditionsPage />}
          />
          <Route
            path="/report/extract/:reportId"
            element={<ReportExtractPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
