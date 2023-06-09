import { Box, CircularProgress, Modal } from "@mui/material";
import React, { ReactNode } from "react";
import { useRecoilValue } from "recoil";
import LoadingState from "../recoil/LoadingState";

type Props = {
  children: ReactNode;
};

/**
 * Provider for displaying loafing modal
 * @param param0
 * @returns
 */
const LoadingProvider: React.FC<Props> = ({ children }) => {
  const open = useRecoilValue(LoadingState.open);
  const message = useRecoilValue(LoadingState.message);

  return (
    <>
      {/* loading modal */}
      <Modal open={open}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100vh",
            color: "whitesmoke",
          }}
        >
          <Box sx={{ mr: 2 }}>
            <CircularProgress color="inherit" size="4rem" />
          </Box>
          <Box>{message}</Box>
        </Box>
      </Modal>
      {children}
    </>
  );
};

export default LoadingProvider;
