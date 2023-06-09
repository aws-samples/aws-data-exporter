import { ExtractCondition, Report } from "../@types/report";
import useHttp from "../hooks/useHttp";

export type GetReportListResponse = {
  report: Report[];
};

export type GetReportResponse = {
  report: Report;
};

export type RegisterReportParams = {
  reportName: string;
  tableName: string;
  columns: string[];
  conditions: ExtractCondition[];
};

export type RegisterReportResponse = {
  reportId: string;
};

const useReportApi = () => {
  const http = useHttp();

  return {
    getMyReportList: () => {
      return http.get<GetReportListResponse>("/report?type=my");
    },
    getSharedReportList: () => {
      return http.get<GetReportListResponse>("/report?type=shared");
    },
    getReportById: (reportId?: string) => {
      return http.get<GetReportResponse>(
        reportId ? `/report/${reportId}` : null
      );
    },
    registerReport: (params: RegisterReportParams) => {
      return http.post<RegisterReportResponse>("/report", {
        ...params,
      });
    },
    shareReport: (reportId: string, sharedUserId: string) => {
      return http.post<null>(`report/share/${reportId}`, {
        sharedUserEmail: sharedUserId,
      });
    },
  };
};

export default useReportApi;
