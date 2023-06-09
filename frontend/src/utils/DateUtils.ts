import dayjs, { ConfigType } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
const FORMAT_DATETIME = "YYYY-MM-DD HH:mm:ss";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * format date in datetime format
 *
 * @param date
 * @returns
 */
export const formatDatetime = (date: ConfigType): string => {
  return dayjs(date).tz().format(FORMAT_DATETIME);
};
