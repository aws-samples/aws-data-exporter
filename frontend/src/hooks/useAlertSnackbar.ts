import { useRecoilState } from "recoil";
import AlertSnackbarState from "../recoil/AlertSnackbarState";

/**
 * Hooks for Displaying Alert
 * @returns
 */
const useAlertSnackbar = () => {
  const [, setOpen] = useRecoilState(AlertSnackbarState.open);
  const [, setMessage] = useRecoilState(AlertSnackbarState.message);
  const [, setSeveriry] = useRecoilState(AlertSnackbarState.severity);

  return {
    openSucces: (message: string) => {
      setOpen(true);
      setMessage(message);
      setSeveriry("success");
    },
    openError: (message: string) => {
      setOpen(true);
      setMessage(message);
      setSeveriry("error");
    },
  };
};

export default useAlertSnackbar;
