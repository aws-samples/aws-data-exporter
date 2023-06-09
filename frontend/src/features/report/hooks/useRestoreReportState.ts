import { useEffect, useMemo } from "react";
import useReportApi from "../../../api/useReportApi";
import useReportState from "./useReportState";

const useRestoreReportState = (targetReportId: string) => {
  const { reportId, setReport } = useReportState();
  const { getReportById } = useReportApi();

  // should retrieve and restore reports from the back end
  const shouldRestoreReport = useMemo<boolean>(() => {
    // Not retrieved if NewReport
    // Not retrieved if report information is set in State (report is being edited).
    return targetReportId !== "new" && targetReportId !== reportId;
  }, []);

  // Get report if ReportId specified
  const { data: resGetReport } = getReportById(
    shouldRestoreReport ? targetReportId : undefined
  );

  useEffect(() => {
    // Set Report State to the report retrieved from the backend
    if (resGetReport) {
      setReport(resGetReport.report);
    }
  }, [resGetReport]);

  return {
    shouldRestoreReport,
  };
};

export default useRestoreReportState;
