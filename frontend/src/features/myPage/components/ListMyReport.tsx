import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import useReportApi from "../../../api/useReportApi";
import useAlertSnackbar from "../../../hooks/useAlertSnackbar";
import useLoading from "../../../hooks/useLoading";
import ListReport from "./ListReport";

const ListMyReport = () => {
  const { getMyReportList, shareReport } = useReportApi();
  const loading = useLoading();
  const { openSucces } = useAlertSnackbar();
  const { t } = useTranslation();

  const { data } = getMyReportList();

  const onShare = useCallback((reportId: string, mail: string) => {
    loading.open();

    // Return Promise for post-processing
    return shareReport(reportId, mail)
      .then(() => {
        openSucces(
          t("myPage.reportList.message.shareSuccess", { userName: mail })
        );
        return true;
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        loading.close();
      });
  }, []);

  return (
    <ListReport
      reports={data?.report}
      emptyMessage={t("myPage.reportList.message.noSavedReport")}
      onShare={onShare}
    />
  );
};

export default ListMyReport;
