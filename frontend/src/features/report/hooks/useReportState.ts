import update from "immutability-helper";
import { useTranslation } from "react-i18next";
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";
import { ExtractCondition, Report, TableColumn } from "../../../@types/report";

// SessionStorageに格納して、更新ボタンでStateが初期化されないようにする
const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: sessionStorage,
});

/**
 * Defines Report State
 */
const reportIdState = atom<string>({
  key: "reportId",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

const reportNameState = atom<string>({
  key: "reportName",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

const tableNameState = atom<string>({
  key: "tableId",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

const selectColumnsState = atom<TableColumn[]>({
  key: "selectColumns",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

const extractConditionsState = atom<ExtractCondition[]>({
  key: "extractConditions",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

// Generate initial search conditions for each type
const generateInitialConditions = (
  columnName: string,
  type: TableColumn["type"]
): ExtractCondition => {
  switch (type) {
    case "string":
      return {
        type,
        columnName,
        operator: "eq",
        value: null,
      };
    case "number":
      return {
        type,
        columnName,
        operator: "eq",
        value: null,
      };
    case "date":
      return {
        type: "relativeDate",
        columnName,
        period: "today",
      };
  }
};

/**
 * Hooks for manage ReportState
 * @returns
 */
const useReportState = () => {
  const { t } = useTranslation();

  const [reportId, setReportId] = useRecoilState(reportIdState);
  const [reportName, setReportName] = useRecoilState(reportNameState);
  const [tableName, setTableName] = useRecoilState(tableNameState);
  const [selectColumns, setSelectColumns] = useRecoilState(selectColumnsState);
  const [extractConditions, setExtractConditions] = useRecoilState(
    extractConditionsState
  );

  return {
    reportId,
    reportName,
    setReportName,
    tableName,
    setTableName,
    selectColumns,
    extractConditions,

    /**
     * initialize all state
     */
    clear: () => {
      setReportId("");
      setReportName("");
      setTableName("");
      setSelectColumns([]);
      setExtractConditions([]);
    },

    /**
     * Set all States related to the Report
     * @param report
     */
    setReport: (report: Report) => {
      setReportId(report.reportId);
      setReportName(report.reportName);
      setTableName(report.tableName);
      // typeは一律でstringを設定し、画面から最新化する
      setSelectColumns(
        report.columns.map((col) => ({
          name: col,
          type: "string",
        }))
      );
      setExtractConditions(report.conditions);
    },

    /**
     * Set all States related to the Report(for copy)
     * @param report
     */
    setReportForCopy: (report: Report) => {
      setReportId("");
      setReportName(
        t("reportPage.field.prefixCopiedReport") + report.reportName
      );
      setTableName(report.tableName);
      // typeは一律でstringを設定し、画面から最新化する
      setSelectColumns(
        report.columns.map((col) => ({
          name: col,
          type: "string",
        }))
      );
      setExtractConditions(report.conditions);
    },

    /**
     * Update SelectColumns State by TableColumns
     * @param tableColumns
     */
    updateSelectColumnType: (tableColumns: TableColumn[]) => {
      const tmp: TableColumn[] = [];
      selectColumns.forEach((col) => {
        const find = tableColumns.find(
          (tableCol) => tableCol.name === col.name
        );
        if (find) {
          tmp.push(find);
        }
      });
      setSelectColumns(tmp);
    },
    /**
     * Move SelectColumns state
     * @param fromIndex
     * @param toIndex
     */
    moveSelectColumn: (fromIndex: number, toIndex: number) => {
      setSelectColumns((prevCards) =>
        update(prevCards, {
          $splice: [
            [fromIndex, 1],
            [toIndex, 0, prevCards[fromIndex]],
          ],
        })
      );
    },
    /**
     * Move ExtractConditions state
     * @param fromIndex
     * @param toIndex
     */
    moveExtractCondition: (fromIndex: number, toIndex: number) => {
      setExtractConditions((prevCards) =>
        update(prevCards, {
          $splice: [
            [fromIndex, 1],
            [toIndex, 0, prevCards[fromIndex]],
          ],
        })
      );
    },
    /**
     * Add to the end of SelectColumns state
     * @param column
     * @returns
     */
    addSelectColumn: (column: TableColumn) => {
      // 既に追加されている項目は追加しない
      if (selectColumns.findIndex((col) => col.name === column.name) > -1) {
        return;
      }

      setSelectColumns(
        update(selectColumns, column ? { $push: [column] } : { $push: [] })
      );
    },

    /**
     * Add generated conditions by table columns to the end of ExtractConditions state
     * @param item
     */
    addExtractCondition: (item: TableColumn) => {
      setExtractConditions(
        update(
          extractConditions,
          item
            ? {
                $push: [generateInitialConditions(item.name, item.type)],
              }
            : { $push: [] }
        )
      );
    },

    /**
     * Update ExtractConditions State of the specified index
     * @param value new ExtractCondition
     * @param index update target index
     */
    updateExtractCondition: (value: ExtractCondition, index: number) => {
      // Replace elements with splice to make it work reactively
      setExtractConditions(
        update(extractConditions, {
          $splice: [[index, 1, value]],
        })
      );
    },

    /**
     * Delete SelectColumns State by index
     * @param index delete target index
     */
    deleteSelectColumn: (index: number) => {
      setSelectColumns(
        update(selectColumns, {
          $splice: [[index, 1]],
        })
      );
    },

    /**
     * Delete ExtractConditions State by index
     * @param index delete target index
     */
    deleteExtractCondition: (index: number) => {
      setExtractConditions(
        update(extractConditions, {
          $splice: [[index, 1]],
        })
      );
    },
  };
};

export default useReportState;
