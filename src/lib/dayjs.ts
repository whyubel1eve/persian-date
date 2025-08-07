import baseDayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import jalaliPlugin from "jalali-plugin-dayjs";

baseDayjs.extend(utc);
baseDayjs.extend(timezone);
baseDayjs.extend(customParseFormat);
baseDayjs.extend(jalaliPlugin);

export const dayjs = baseDayjs;
export type { Dayjs } from "dayjs";
