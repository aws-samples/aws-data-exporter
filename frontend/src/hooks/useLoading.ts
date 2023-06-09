import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import LoadingState from "../recoil/LoadingState";

/**
 * Hooks for displaying loading modal
 * @returns
 */
const useLoading = () => {
  const { t } = useTranslation();
  const [, setOpen] = useRecoilState(LoadingState.open);
  const [, setMessage] = useRecoilState(LoadingState.message);

  return {
    open: (message?: string) => {
      setOpen(true);
      setMessage(message ?? t("app.message.loading"));
    },
    close: () => {
      setOpen(false);
    },
  };
};

export default useLoading;
