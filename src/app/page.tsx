"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import moment from "moment-jalaali";

export default function Home() {
  const [persianDate, setPersianDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [error, setError] = useState("");

  const convertDate = (input: string) => {
    // Clear previous error
    setError("");

    // Validate input format
    const datePattern = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
    const match = input.match(datePattern);

    if (!match) {
      setError("Please enter date in YYYY/MM/DD format, e.g.: 1401/03/22");
      setGregorianDate("");
      return;
    }

    const [, year, month, day] = match;
    const persianYear = parseInt(year);
    const persianMonth = parseInt(month);
    const persianDay = parseInt(day);

    // Validate date validity
    if (
      persianMonth < 1 ||
      persianMonth > 12 ||
      persianDay < 1 ||
      persianDay > 31
    ) {
      setError("Please enter a valid Persian date");
      setGregorianDate("");
      return;
    }

    try {
      // Use moment-jalaali for conversion, using UTC to avoid timezone issues
      const gregorianMoment = moment.utc(
        `${persianYear}/${persianMonth}/${persianDay}`,
        "jYYYY/jM/jD"
      );

      if (gregorianMoment.isValid()) {
        const formattedDate = gregorianMoment.format("YYYY/MM/DD");
        setGregorianDate(`${formattedDate}`);
      } else {
        setError("Invalid Persian date");
        setGregorianDate("");
      }
    } catch {
      setError("Date conversion error");
      setGregorianDate("");
    }
  };

  return (
    <Card className="w-full max-w-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg border-0 mx-4">
      <CardHeader className="text-center space-y-3 pt-8">
        <CardTitle className="text-4xl font-medium">
          Persian to Gregorian Date Converter
        </CardTitle>
        <p className="text-base text-gray-500 dark:text-gray-400">
          Enter Persian date (format: YYYY/MM/DD)
        </p>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full max-w-xl space-y-2">
            <Input
              type="text"
              placeholder="1401/03/22"
              value={persianDate}
              onChange={(e) => {
                setPersianDate(e.target.value);
                convertDate(e.target.value);
              }}
              className="!text-xl text-center h-12 text-gray-700 dark:text-gray-200"
            />
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 text-center mt-2">
                {error}
              </p>
            )}
          </div>

          {gregorianDate && (
            <div className="w-full max-w-xl p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="text-center space-y-4">
                <h3 className="text-base font-medium text-gray-500 dark:text-gray-400">
                  Gregorian Date
                </h3>
                {gregorianDate.split("\n").map((date, index) => (
                  <p
                    key={index}
                    className="text-3xl font-semibold text-blue-700 dark:text-blue-300"
                  >
                    {date}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
