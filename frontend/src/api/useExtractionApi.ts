import { ExtractCondition } from "../@types/report";
import useHttp from "../hooks/useHttp";

export type ExtractionHistoryResponse = {
  historyRecords: {
    tableName: string;
    conditions: ExtractCondition[];
    columns: string[];
    extractionTime: string;
  }[];
};

export type ExtractDataParams = {
  tableName: string;
  columns: string[];
  conditions: ExtractCondition[];
};
export type ExtractDataResponse = {
  items: string[][];
};

const useExtractionApi = () => {
  const http = useHttp();

  return {
    getExtractionHistory: () => {
      return http.get<ExtractionHistoryResponse>("/extract/history");
    },
    extractData: (params: ExtractDataParams) => {
      return http.post<ExtractDataResponse>("/extract", params);
    },
  };
};

export default useExtractionApi;
