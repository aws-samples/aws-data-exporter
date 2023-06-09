import { TableColomnType } from "../@types/report";
import useHttp from "../hooks/useHttp";

export type GetTableListResponse = {
  tables: string[];
};

export type GetTableColumnsResponse = {
  name: string;
  columns: {
    name: string;
    type: TableColomnType;
  }[];
};

const useTableApi = () => {
  const http = useHttp();

  return {
    getTableList: () => {
      return http.get<GetTableListResponse>("/table");
    },
    getTableColumns: (tableName: string) => {
      return http.get<GetTableColumnsResponse>(
        tableName ? `/table/${tableName}` : null
      );
    },
  };
};

export default useTableApi;
