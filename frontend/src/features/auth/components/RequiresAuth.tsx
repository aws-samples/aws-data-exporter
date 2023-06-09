import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loading from "../../../components/Loading";
import SignInPage from "../pages/SignInPage";

const RequiresAuth: React.FC = () => {
  return (
    <SignInPage>
      {/* Display Route child components after user is authenticated */}
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </SignInPage>
  );
};

export default RequiresAuth;
