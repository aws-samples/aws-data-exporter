import { AlertColor } from "@mui/material";
import { atom } from "recoil";
/**
 * AlertSnackbarState
 */

/**
 * for open alert
 */
const open = atom({
  key: "openAlertSnackbar",
  default: false,
});

/**
 * displaying message
 */
const message = atom({
  key: "alertSnackbarMessage",
  default: "",
});

/**
 * severity of alert
 */
const severity = atom<AlertColor>({
  key: "alertSnackbarSeverity",
  default: "error",
});

const AlertSnackbarState = {
  open,
  message,
  severity,
};

export default AlertSnackbarState;
