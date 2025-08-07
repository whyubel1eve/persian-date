"use client";

import * as React from "react";
import { dayjs, Dayjs } from "@/lib/dayjs";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TIMEZONE_UTC8,
  formatGregorianDisplay,
  isTodayUtc8,
} from "@/lib/datetime";

interface GregorianDateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function GregorianDateTimePicker({
  value,
  onChange,
  placeholder = "Select Date and Time",
  className,
}: GregorianDateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const [selectedHour, setSelectedHour] = React.useState<string>("00");
  const [selectedMinute, setSelectedMinute] = React.useState<string>("00");
  const [currentMonth, setCurrentMonth] = React.useState<Dayjs>(
    dayjs().tz(TIMEZONE_UTC8)
  );
  const [disableCloseAnimation, setDisableCloseAnimation] =
    React.useState(false);

  const handleYearChange = (year: string) => {
    const newMonth = currentMonth.year(parseInt(year));
    setCurrentMonth(newMonth);
  };

  // Parse the value prop to set initial state, or default to today
  React.useEffect(() => {
    let initialDate: Dayjs;
    if (value) {
      const match = value.match(
        /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/
      );
      if (match) {
        const [, year, month, day, hours, minutes] = match;
        const m = dayjs(`${year}/${month}/${day}`, "YYYY/M/D");
        if (m.isValid()) {
          initialDate = m.tz(TIMEZONE_UTC8);
          setSelectedHour(hours ? hours.padStart(2, "0") : "00");
          setSelectedMinute(minutes ? minutes.padStart(2, "0") : "00");
        } else {
          initialDate = dayjs().tz(TIMEZONE_UTC8); // Fallback to now if parsing fails
        }
      } else {
        initialDate = dayjs().tz(TIMEZONE_UTC8); // Fallback to now if regex fails
      }
    } else {
      initialDate = dayjs().tz(TIMEZONE_UTC8); // Default to now if no value
    }

    setSelectedDate(initialDate);
    setCurrentMonth(initialDate);
    setSelectedHour(initialDate.format("HH"));
    setSelectedMinute(initialDate.format("mm"));
  }, [value, open]);

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

  const gregorianWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Dayjs) => {
    const year = date.year();
    const month = date.month();
    const daysInMonth = date.daysInMonth();
    const firstDayOfMonth = dayjs(`${year}/${month + 1}/1`, "YYYY/M/D");
    const startDayOfWeek = firstDayOfMonth.day();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const newDate = dayjs(
      `${currentMonth.year()}/${currentMonth.month() + 1}/${day}`,
      "YYYY/M/D"
    ).tz(TIMEZONE_UTC8, true);
    setSelectedDate(newDate);
  };

  const handleHourChange = (hour: string) => {
    setSelectedHour(hour);
  };

  const handleMinuteChange = (minute: string) => {
    setSelectedMinute(minute);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedDate.isValid()) {
      const dateStr = selectedDate.format("YYYY/MM/DD");
      const timeStr = `${selectedHour}:${selectedMinute}`;
      onChange(`${dateStr} ${timeStr}`);
    }
    setDisableCloseAnimation(true);
    setOpen(false);
    // Reset animation state after a brief delay
    setTimeout(() => setDisableCloseAnimation(false), 50);
  };

  const handleToday = () => {
    const now = dayjs().tz(TIMEZONE_UTC8);
    const dateStr = now.format("YYYY/MM/DD");
    const timeStr = now.format("HH:mm");
    onChange(`${dateStr} ${timeStr}`);
    setDisableCloseAnimation(true);
    setOpen(false);
    // Reset animation state after a brief delay
    setTimeout(() => setDisableCloseAnimation(false), 50);
  };

  const getDisplayValue = () => (value ? formatGregorianDisplay(value) : "");

  const days = getDaysInMonth(currentMonth);
  const isToday = (day: number) => isTodayUtc8(day, currentMonth);

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.date() &&
      currentMonth.month() === selectedDate.month() &&
      currentMonth.year() === selectedDate.year()
    );
  };

  // Generate year options (current year ± 50 years)
  const currentYear = dayjs().tz(TIMEZONE_UTC8).year();
  const yearOptions = Array.from(
    { length: 101 },
    (_, i) => currentYear - 50 + i
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between text-left font-normal h-16 text-xl px-4 border-2 hover:border-primary/50 transition-all duration-200",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <span className="font-mono">
              {getDisplayValue() || placeholder}
            </span>
          </div>
          {value && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Picker</span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 max-w-[90vw] sm:max-w-[400px] max-h-[85vh] overflow-hidden"
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={8}
        disableCloseAnimation={disableCloseAnimation}
      >
        <div className="p-2 sm:p-3 space-y-2 sm:space-y-3 max-h-[85vh] overflow-y-auto">
          {/* Month and Year selector */}
          <div className="flex items-center justify-center gap-1">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <Select
                value={currentMonth.month().toString()}
                onValueChange={(value) => {
                  setCurrentMonth(currentMonth.clone().month(parseInt(value)));
                }}
              >
                <SelectTrigger className="h-7 text-xs flex-1 min-w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {gregorianMonths.map((month, index) => (
                    <SelectItem
                      key={index}
                      value={index.toString()}
                      className="text-xs"
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currentMonth.year().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-[70px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {yearOptions.map((year) => (
                    <SelectItem
                      key={year}
                      value={year.toString()}
                      className="text-xs"
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calendar Grid */}
          <div>
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {gregorianWeekDays.map((day, index) => (
                <div
                  key={index}
                  className="text-center text-xs font-medium text-muted-foreground h-[18px] flex items-center justify-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {days.map((day, index) => (
                <div key={index} className="w-[24px] h-[24px]">
                  {day ? (
                    <Button
                      variant="ghost"
                      className={cn(
                        "h-full w-full p-0 font-normal text-xs hover:bg-primary/10 rounded-sm",
                        isToday(day) && "bg-accent text-accent-foreground",
                        isSelected(day) &&
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                      )}
                      onClick={() => handleDateSelect(day)}
                    >
                      {day}
                    </Button>
                  ) : (
                    <div />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Time Selector */}
          <div className="border-t pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Select Time</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="text-xs">UTC+8</span>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Hour
                </label>
                <Select value={selectedHour} onValueChange={handleHourChange}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[150px]">
                    {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                      <SelectItem
                        key={hour}
                        value={hour.toString().padStart(2, "0")}
                        className="text-sm"
                      >
                        {hour.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-lg font-bold text-muted-foreground pb-1">
                :
              </div>

              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">
                  Minute
                </label>
                <Select
                  value={selectedMinute}
                  onValueChange={handleMinuteChange}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[150px]">
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                      <SelectItem
                        key={minute}
                        value={minute.toString().padStart(2, "0")}
                        className="text-sm"
                      >
                        {minute.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-2 flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="text-xs h-8"
            >
              Now
            </Button>

            <Button
              size="sm"
              onClick={handleConfirm}
              className="bg-primary hover:bg-primary/90 text-xs h-8"
            >
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
