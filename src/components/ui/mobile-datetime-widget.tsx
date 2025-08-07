"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getNowInUtc8, getNowInIranPersian } from "@/lib/datetime";

export function MobileDateTimeWidget() {
  const [gregorianTime, setGregorianTime] = useState("");
  const [persianTime, setPersianTime] = useState("");

  const updateDateTime = useCallback(() => {
    setGregorianTime(getNowInUtc8());
    setPersianTime(getNowInIranPersian());
  }, []);

  useEffect(() => {
    // Initial update
    updateDateTime();

    // Calculate delay to sync with the next second
    const now = new Date();
    const msUntilNextSecond = 1000 - now.getMilliseconds();

    let interval: NodeJS.Timeout;

    // Set initial timeout to sync with the system clock
    const syncTimeout = setTimeout(() => {
      updateDateTime();
      // Then update every second
      interval = setInterval(updateDateTime, 1000);
    }, msUntilNextSecond);

    return () => {
      clearTimeout(syncTimeout);
      if (interval) clearInterval(interval);
    };
  }, [updateDateTime]);

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <Card className="backdrop-blur-sm border-2 shadow-lg bg-card/95">
        <CardContent className="p-3">
          <div className="flex items-center justify-between text-sm">
            <div className="space-y-1 flex-1">
              <div className="text-xs font-medium text-muted-foreground">
                Gregorian (UTC+8)
              </div>
              <div className="font-mono text-xs font-bold text-primary">
                {gregorianTime}
              </div>
            </div>
            <div className="space-y-1 flex-1 text-center">
              <div className="text-xs font-medium text-muted-foreground">
                Persian (IRST)
              </div>
              <div
                className="font-mono text-xs font-bold text-primary"
                style={{ direction: "ltr" }}
              >
                {persianTime}
              </div>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
