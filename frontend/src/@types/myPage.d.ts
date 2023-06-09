import { ExtractCondition } from "./report";

export type MenuEnum = "saved" | "shared" | "history";

export type UserProfile = {
  downloadable: boolean;
  email: string;
};

export type ExtractHistoryListItem = {
  tableName: string;
  extractionTime: string;
  columns: string[];
  conditions: ExtractCondition[];
};
