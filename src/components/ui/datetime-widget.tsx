"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getNowInUtc8, getNowInIranPersian } from "@/lib/datetime";

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
          {/* Subtle highlight */}
          <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-primary/50 rounded-full"></span>
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
    <div className="font-mono text-base font-medium text-foreground/90 tracking-wide">
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

    setGregorianTime(getNowInUtc8());
    setPersianTime(getNowInIranPersian());
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
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 lg:left-8 hidden md:block">
      <div className="bg-card/90 backdrop-blur-2xl border border-border/20 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 min-w-[240px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-foreground">Live Time</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-muted-foreground font-medium">Live</span>
          </div>
        </div>

        <div className="space-y-5">
          {/* Gregorian Time */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-medium">
              Gregorian
            </div>
            <div className="bg-background/50 rounded-xl px-4 py-3 border border-border/10">
              <AnimatedTimeDisplay
                timeString={gregorianTime}
                previousTimeString={previousGregorianTime.current}
              />
            </div>
          </div>

          {/* Persian Time */}
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-medium">
              Persian
            </div>
            <div className="bg-background/50 rounded-xl px-4 py-3 border border-border/10" style={{ direction: "ltr" }}>
              <AnimatedTimeDisplay
                timeString={persianTime}
                previousTimeString={previousPersianTime.current}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
