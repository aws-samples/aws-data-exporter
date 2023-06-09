import { Alert, Snackbar } from "@mui/material";
import React, { ReactNode } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import AlertSnackbarState from "../recoil/AlertSnackbarState";

type Props = {
  children: ReactNode;
};

/**
 * Provider for Displaying alert
 * @param param0
 * @returns
 */
const AlertSnackbarProvider: React.FC<Props> = ({ children }) => {
  const [open, setOpen] = useRecoilState(AlertSnackbarState.open);
  const message = useRecoilValue(AlertSnackbarState.message);
  const severity = useRecoilValue(AlertSnackbarState.severity);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
      {children}
    </>
  );
};

export default AlertSnackbarProvider;
