import { dayjs } from "@/lib/dayjs";

export const TIMEZONE_IRAN = "Asia/Tehran"; // IRST/IRDT
export const TIMEZONE_UTC8 = "Asia/Shanghai"; // CST

export type ConversionDirection =
  | "persian-to-gregorian"
  | "gregorian-to-persian";

export const PERSIAN_INPUT_REGEX =
  /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?(?:\(([A-Z]{3})\))?$/;

export const GREGORIAN_INPUT_REGEX =
  /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?$/;

export function isValidTime(hour: number, minute: number): boolean {
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

export function parseTimeParts(hours?: string, minutes?: string) {
  const hourNum = hours ? parseInt(hours) : 0;
  const minuteNum = minutes ? parseInt(minutes) : 0;
  return { hourNum, minuteNum };
}

export function convertPersianToGregorian(input: string): {
  ok: boolean;
  value?: string;
  error?: string;
} {
  if (!input.trim()) return { ok: true, value: "" };
  const match = input.match(PERSIAN_INPUT_REGEX);
  if (!match)
    return {
      ok: false,
      error: "Please enter in format: YYYY/MM/DD HH:MM or YYYY/MM/DD",
    };

  const [, year, month, day, hours, minutes] = match;
  const persianYear = parseInt(year);
  const persianMonth = parseInt(month);
  const persianDay = parseInt(day);

  const { hourNum, minuteNum } = parseTimeParts(hours, minutes);

  if (!isValidTime(hourNum, minuteNum)) {
    return { ok: false, error: "Please enter a valid time (00:00 - 23:59)" };
  }

  const timeString = `${hourNum.toString().padStart(2, "0")}:${minuteNum
    .toString()
    .padStart(2, "0")}`;

  // Create a Day.js object by parsing the Jalali date and time.
  // Then, specify that this date/time is in the Iran timezone.
  const tehranLocal = dayjs(
    `${persianYear}-${persianMonth}-${persianDay} ${timeString}`,
    {
      jalali: true, // Specify that we are parsing a Jalali date
      format: "YYYY-M-D HH:mm", // This format is for Day.js internal use, not display
    }
  )
    .tz(TIMEZONE_IRAN, true) // Then, set the timezone to Iran, `true` keeps local time
    .calendar("jalali")
    .locale("fa");

  if (!tehranLocal.isValid()) {
    return { ok: false, error: "Invalid Persian date or time" };
  }

  const utc8 = tehranLocal.tz(TIMEZONE_UTC8);
  const gregorianDate = utc8.format("YYYY/MM/DD");
  const gregorianTime = utc8.format("HH:mm");
  return { ok: true, value: `${gregorianDate} ${gregorianTime}` };
}

export function convertGregorianToPersian(input: string): {
  ok: boolean;
  value?: string;
  error?: string;
} {
  if (!input.trim()) return { ok: true, value: "" };
  const match = input.match(GREGORIAN_INPUT_REGEX);
  if (!match)
    return {
      ok: false,
      error: "Please enter in format: YYYY/MM/DD HH:MM or YYYY/MM/DD",
    };

  const [, year, month, day, hours, minutes] = match;
  const gregorianYear = parseInt(year);
  const gregorianMonth = parseInt(month);
  const gregorianDay = parseInt(day);

  const { hourNum, minuteNum } = parseTimeParts(hours, minutes);
  if (!isValidTime(hourNum, minuteNum)) {
    return { ok: false, error: "Please enter a valid time (00:00 - 23:59)" };
  }

  const timeString = `${hourNum.toString().padStart(2, "0")}:${minuteNum
    .toString()
    .padStart(2, "0")}`;

  const utc8 = dayjs.tz(
    `${gregorianYear}/${gregorianMonth}/${gregorianDay} ${timeString}`,
    "YYYY/M/D HH:mm",
    TIMEZONE_UTC8
  );
  if (!utc8.isValid()) {
    return { ok: false, error: "Invalid Gregorian date or time" };
  }

  const tehran = utc8.tz(TIMEZONE_IRAN);
  if (!tehran.isValid()) {
    return { ok: false, error: "Invalid date conversion" };
  }

  const persianDate = tehran.calendar("jalali").format("YYYY/MM/DD");
  const persianTime = tehran.format("HH:mm");
  return { ok: true, value: `${persianDate} ${persianTime}` };
}

export function getNowInUtc8(): string {
  return dayjs().tz(TIMEZONE_UTC8).format("YYYY/MM/DD HH:mm:ss");
}

export function getNowInIranPersian(): string {
  const ir = dayjs().tz(TIMEZONE_IRAN);
  const datePart = ir.calendar("jalali").format("YYYY/MM/DD");
  const timePart = ir.format("HH:mm:ss");
  return `${datePart} ${timePart}`;
}

// For Persian picker: returns `YYYY/MM/DD HH:mm` in Jalali, using Tehran time
export function getNowIranPersianForPicker(): string {
  const ir = dayjs().tz(TIMEZONE_IRAN);
  const datePart = ir.calendar("jalali").format("YYYY/MM/DD");
  const timePart = ir.format("HH:mm");
  return `${datePart} ${timePart}`;
}

export function formatPersianDisplay(value: string): string {
  const match = value.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/
  );
  if (!match) return value;
  const [, year, month, day, hours = "00", minutes = "00"] = match;
  const m = dayjs(`${year}/${month}/${day}`, { jalali: true });
  if (!m.isValid()) return value;
  const persianMonths = [
    "فروردین (Farvardin)",
    "اردیبهشت (Ordibehesht)",
    "خرداد (Khordad)",
    "تیر (Tir)",
    "مرداد (Mordad)",
    "شهریور (Shahrivar)",
    "مهر (Mehr)",
    "آبان (Aban)",
    "آذر (Azar)",
    "دی (Dey)",
    "بهمن (Bahman)",
    "اسفند (Esfand)",
  ];
  // Convert to jalali calendar to use jalali getters
  const mj = m.calendar("jalali");
  const monthName = persianMonths[mj.month()];
  const dayNum = mj.date();
  const yearNum = mj.year();
  return `${dayNum} ${monthName} ${yearNum} - ${hours.padStart(
    2,
    "0"
  )}:${minutes.padStart(2, "0")}`;
}

export function formatGregorianDisplay(value: string): string {
  const match = value.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/
  );
  if (!match) return value;
  const [, year, month, day, hours = "00", minutes = "00"] = match;
  const m = dayjs(`${year}/${month}/${day}`, "YYYY/M/D");
  if (!m.isValid()) return value;
  const gregorianMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = gregorianMonths[m.month()];
  const dayNum = m.date();
  const yearNum = m.year();
  return `${dayNum} ${monthName} ${yearNum} - ${hours.padStart(
    2,
    "0"
  )}:${minutes.padStart(2, "0")}`;
}

import type { Dayjs } from "dayjs";

export function isTodayIranPersian(day: number, currentMonth: Dayjs): boolean {
  const today = dayjs().tz(TIMEZONE_IRAN).calendar("jalali");
  const month = currentMonth.calendar
    ? currentMonth.calendar("jalali")
    : currentMonth;
  return (
    day === today.date() &&
    month.month() === today.month() &&
    month.year() === today.year()
  );
}

export function isTodayUtc8(day: number, currentMonth: Dayjs): boolean {
  const today = dayjs().tz(TIMEZONE_UTC8);
  return (
    day === today.date() &&
    currentMonth.month() === today.month() &&
    currentMonth.year() === today.year()
  );
}

// Helpers useful for future migration to dayjs/date-fns can be kept API-compatible here.
