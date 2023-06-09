import { atom } from "recoil";
/**
 * LoadingState
 */

/**
 * open loading
 */
const open = atom({
  key: "openLoading",
  default: false,
});

/**
 * displaying message
 */
const message = atom({
  key: "loadingMessage",
  default: "",
});

const LoadingState = {
  open,
  message,
};

export default LoadingState;
