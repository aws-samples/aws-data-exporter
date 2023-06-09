import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import useAlertSnackbar from "../hooks/useAlertSnackbar";
import useHttp from "../hooks/useHttp";

export type ExportParams = {
  columns: string[];
  table: string[][];
};

const useExportApi = () => {
  const http = useHttp();
  const alert = useAlertSnackbar();
  const { t } = useTranslation();

  return {
    exportData: (params: ExportParams) => {
      const errorProcess = (error: AxiosError) => {
        if (error.response?.status === 403) {
          alert.openError(t("app.error.downloadDenied"));
        } else {
          alert.openError(error.message);
        }
      };
      return http.post<Blob>("/export", params, errorProcess);
    },
  };
};

export default useExportApi;
