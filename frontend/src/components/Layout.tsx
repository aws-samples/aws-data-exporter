import { Box, Toolbar } from "@mui/material";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AppDrawer from "./AppDrawer";
import AppHeader from "./AppHeader";
import Loading from "./Loading";

/**
 * Page layout
 * @param param0
 * @returns
 */
const Layout: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <>
      <AppHeader
        signOut={() => {
          signOut();
        }}
      />
      <AppDrawer />

      <Box component="main">
        <Suspense fallback={<Loading />}>
          {/* Toolbar is margin for AppHeader */}
          <Toolbar />
          <Outlet />
        </Suspense>
      </Box>
    </>
  );
};

export default Layout;
