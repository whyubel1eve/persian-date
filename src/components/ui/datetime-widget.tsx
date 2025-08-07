"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import moment from "moment-jalaali";
import "moment-timezone";

interface AnimatedCharacterProps {
  char: string;
  previousChar: string;
  isAnimating: boolean;
}

function AnimatedCharacter({
  char,
  previousChar,
  isAnimating,
}: AnimatedCharacterProps) {
  return (
    <span className="relative inline-block overflow-hidden">
      {isAnimating ? (
        <>
          {/* Old character sliding out */}
          <span
            className="inline-block animate-slide-up-out absolute top-0 left-0"
            style={{ width: "1ch" }}
          >
            {previousChar}
          </span>
          {/* New character sliding in */}
          <span
            className="inline-block animate-slide-up-in"
            style={{ width: "1ch" }}
          >
            {char}
          </span>
          {/* Underline indicator */}
          <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full animate-pulse"></span>
        </>
      ) : (
        <span className="inline-block" style={{ width: "1ch" }}>
          {char}
        </span>
      )}
    </span>
  );
}

interface AnimatedTimeDisplayProps {
  timeString: string;
  previousTimeString: string;
}

function AnimatedTimeDisplay({
  timeString,
  previousTimeString,
}: AnimatedTimeDisplayProps) {
  const [animatingIndices, setAnimatingIndices] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    // Find which characters changed
    const changedIndices = new Set<number>();
    for (let i = 0; i < timeString.length; i++) {
      if (timeString[i] !== previousTimeString[i]) {
        changedIndices.add(i);
      }
    }

    if (changedIndices.size > 0) {
      setAnimatingIndices(changedIndices);
      // Reset animation after delay (matches CSS animation duration)
      const timer = setTimeout(() => {
        setAnimatingIndices(new Set());
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [timeString, previousTimeString]);

  return (
    <div className="font-mono text-sm font-bold text-primary">
      {timeString.split("").map((char, index) => (
        <AnimatedCharacter
          key={index}
          char={char}
          previousChar={previousTimeString[index] || char}
          isAnimating={animatingIndices.has(index)}
        />
      ))}
    </div>
  );
}

export function DateTimeWidget() {
  const [gregorianTime, setGregorianTime] = useState("");
  const [persianTime, setPersianTime] = useState("");
  const previousGregorianTime = useRef("");
  const previousPersianTime = useRef("");

  const updateDateTime = useCallback(() => {
    // Store previous values
    previousGregorianTime.current = gregorianTime;
    previousPersianTime.current = persianTime;

    // Current time in UTC+8 (China Standard Time)
    const utc8Time = moment().tz("Asia/Shanghai");
    const newGregorianTime = utc8Time.format("YYYY/MM/DD HH:mm:ss");
    setGregorianTime(newGregorianTime);

    // Current time in Persian timezone (IRST - Iran Standard Time)
    const tehranTime = moment().tz("Asia/Tehran");
    // Convert to Persian calendar - moment-jalaali automatically handles this
    const newPersianTime = tehranTime.format("jYYYY/jMM/jDD HH:mm:ss");
    setPersianTime(newPersianTime);
  }, [gregorianTime, persianTime]);

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
    <Card className="fixed left-2 top-1/2 -translate-y-1/2 z-50 min-w-[250px] max-w-[280px] backdrop-blur-sm border-2 shadow-lg bg-card/95 transition-all duration-300 ease-out lg:left-8 lg:min-w-[280px] hidden md:block">
      <CardContent className="p-3 space-y-2 lg:p-4 lg:space-y-3">
        {/* Gregorian Time (UTC+8) */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Gregorian (UTC+8)
          </div>
          <AnimatedTimeDisplay
            timeString={gregorianTime}
            previousTimeString={previousGregorianTime.current}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-border/50"></div>

        {/* Persian Time (IRST) */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Persian (IRST)
          </div>
          <div style={{ direction: "ltr" }}>
            <AnimatedTimeDisplay
              timeString={persianTime}
              previousTimeString={previousPersianTime.current}
            />
          </div>
        </div>

        {/* Time zone indicator */}
        <div className="flex items-center space-x-2 pt-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </CardContent>
    </Card>
  );
}
