"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import moment from "moment-jalaali";
import "moment-timezone";

export default function Home() {
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [gregorianResult, setGregorianResult] = useState("");
  const [error, setError] = useState("");

  const convertDateTime = (input: string) => {
    // Clear previous error
    setError("");

    if (!input.trim()) {
      setGregorianResult("");
      return;
    }

    // Pattern to match formats like:
    // 1404/05/07 00:11(CST)
    // 1404/05/07(CST) - defaults to 00:00
    // 1404/05/07 - defaults to 00:00(CST)
    const fullPattern =
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?(?:\(([A-Z]{3})\))?$/;
    const match = input.match(fullPattern);

    if (!match) {
      setError("Please enter in format: YYYY/MM/DD HH:MM or YYYY/MM/DD");
      setGregorianResult("");
      return;
    }

    const [, year, month, day, hours, minutes] = match;
    const persianYear = parseInt(year);
    const persianMonth = parseInt(month);
    const persianDay = parseInt(day);

    // Default to 00:00 if time not specified
    const hourNum = hours ? parseInt(hours) : 0;
    const minuteNum = minutes ? parseInt(minutes) : 0;

    // Validate date
    if (
      persianMonth < 1 ||
      persianMonth > 12 ||
      persianDay < 1 ||
      persianDay > 31
    ) {
      setError("Please enter a valid Persian date");
      setGregorianResult("");
      return;
    }

    // Validate time
    if (hourNum < 0 || hourNum > 23 || minuteNum < 0 || minuteNum > 59) {
      setError("Please enter a valid time (00:00 - 23:59)");
      setGregorianResult("");
      return;
    }

    const timeString = `${hourNum.toString().padStart(2, "0")}:${minuteNum
      .toString()
      .padStart(2, "0")}`;

    try {
      // First convert Persian date to Gregorian using moment-jalaali
      const persianDateMoment = moment(
        `${persianYear}/${persianMonth}/${persianDay}`,
        "jYYYY/jM/jD"
      );

      if (!persianDateMoment.isValid()) {
        setError("Invalid Persian date");
        setGregorianResult("");
        return;
      }

      // Get Gregorian date string
      const gregorianDateString = persianDateMoment.format("YYYY-MM-DD");

      // Create moment with Gregorian date and time, then set to Persian timezone
      const persianMoment = moment(
        `${gregorianDateString} ${timeString}`,
        "YYYY-MM-DD HH:mm"
      ).tz("Asia/Tehran", true); // true keeps the local time

      if (persianMoment.isValid()) {
        // Convert to UTC+8 (CST - China Standard Time)
        const utc8Moment = persianMoment.clone().tz("Asia/Shanghai");

        const gregorianDate = utc8Moment.format("YYYY/MM/DD");
        const gregorianTime = utc8Moment.format("HH:mm");

        setGregorianResult(`${gregorianDate} ${gregorianTime} (UTC+8)`);
      } else {
        setError("Invalid Persian date or time");
        setGregorianResult("");
      }
    } catch {
      setError("Date conversion error");
      setGregorianResult("");
    }
  };

  const handleInputChange = (value: string) => {
    setDateTimeInput(value);
    convertDateTime(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="backdrop-blur-sm border-2 shadow-xl">
          <CardHeader className="text-center space-y-6 pt-12 pb-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 mb-2">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
              </div>
              <CardTitle className="text-5xl font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent leading-tight">
                تبدیل تاریخ فارسی
              </CardTitle>
              <CardTitle className="text-3xl font-semibold text-foreground/90">
                Persian to Gregorian Date & Time Converter
              </CardTitle>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Convert Persian dates and times(CST) to Gregorian calendar(UTC+8)
            </p>
          </CardHeader>

          <CardContent className="space-y-12 px-8 pb-12">
            <div className="flex flex-col items-center space-y-10">
              {/* Input Section */}
              <div className="w-full max-w-2xl space-y-6">
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-foreground">
                    Persian Date & Time
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="1404/05/07 00:11"
                      value={dateTimeInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="text-2xl text-center h-16 font-mono tracking-wider border-2 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all duration-200 placeholder:text-muted-foreground/40 placeholder:font-normal"
                    />
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <svg
                        className="w-6 h-6 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  {!gregorianResult && (
                    <div className="bg-muted/50 rounded-lg p-4 border">
                      <p className="text-sm text-muted-foreground text-center">
                        <span className="font-semibold">Format:</span>{" "}
                        YYYY/MM/DD HH:MM |
                        <span className="text-primary"> Time optional</span>,
                        defaults to 00:00(CST)
                      </p>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Example: 1404/05/07 15:30 or simply 1404/05/07
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-destructive flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <p className="text-sm text-destructive font-medium">
                        {error}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Result Section */}
              {gregorianResult && (
                <div className="w-full max-w-2xl">
                  <Card className="bg-primary/5 border-primary/20 border-2 shadow-lg">
                    <CardContent className="p-8">
                      <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30">
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold text-foreground">
                            Gregorian Date & Time
                          </h3>
                          <p className="text-4xl font-bold text-primary font-mono tracking-wider">
                            {gregorianResult}
                          </p>
                          <p className="text-base text-muted-foreground">
                            Converted from Persian timezone to UTC+8 (China
                            Standard Time)
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
