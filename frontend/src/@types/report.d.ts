export type TableMeta = {
  tableName: string;
  tableId: string;
};

export type TableColomnType = "string" | "number" | "date";

export type TableColumn = {
  name: string;
  type: TableColomnType;
};

export type ConditionType =
  | "string"
  | "number"
  | "absoluteDate"
  | "relativeDate"
  | "relativeDateN"
  | "time";

export type ConditionOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains";

export type RelativeDateNPeriod = "day" | "week" | "month" | "year";
export type RelativeDatePeriod =
  | "today"
  | "yesterday"
  | "lastWeek"
  | "lastMonth"
  | "lastYear";

export type ExtractCondition = {
  columnName: string;
} & (
  | {
      type: "string";
      operator: ConditionOperator;
      value: string | null;
    }
  | {
      type: "number";
      operator: ConditionOperator;
      value: number | null;
    }
  | {
      type: "absoluteDate";
      startDate: string;
      endDate: string;
    }
  | {
      type: "relativeDateN";
      n: number;
      period: RelativeDateNPeriod;
    }
  | {
      type: "relativeDate";
      period: RelativeDatePeriod;
    }
  | {
      type: "time";
      startTime: string;
      endTime: string;
    }
);

export type Report = {
  reportId: string;
  reportName: string;
  tableName: string;
  conditions: ExtractCondition[];
  columns: string[];
  reportTime: strinf;
};
