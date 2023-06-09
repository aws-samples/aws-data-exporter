import React from "react";
import { useTranslation } from "react-i18next";
import useReportApi from "../../../api/useReportApi";
import ListReport from "./ListReport";

const ListSharedReport = () => {
  const { getSharedReportList } = useReportApi();
  const { t } = useTranslation();

  const { data } = getSharedReportList();
  return (
    <ListReport
      reports={data?.report}
      emptyMessage={t("myPage.reportList.message.noSharedReport")}
    />
  );
};

export default ListSharedReport;
