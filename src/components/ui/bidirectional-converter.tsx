"use client";

import { useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { PersianDateTimePicker } from "@/components/ui/persian-datetime-picker";
import { GregorianDateTimePicker } from "@/components/ui/gregorian-datetime-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  convertPersianToGregorian as convertP2G,
  convertGregorianToPersian as convertG2P,
  type ConversionDirection,
} from "@/lib/datetime";
import {
  Keyboard,
  CalendarDays,
  X,
  Calendar,
  Clock,
} from "lucide-react";
import ElectricBorder from "@/components/ElectricBorder";
// moment usage is centralized in '@/lib/datetime'

type InputMode = "text" | "picker";

export function BidirectionalConverter() {
  const [direction, setDirection] = useState<ConversionDirection>(
    "persian-to-gregorian"
  );
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [sourceInput, setSourceInput] = useState("");
  const [targetOutput, setTargetOutput] = useState("");
  const [error, setError] = useState("");

  const convertPersianToGregorian = useCallback((input: string) => {
    setError("");
    const res = convertP2G(input);
    if (res.ok) {
      setTargetOutput(res.value || "");
    } else {
      setError(res.error || "Date conversion error");
      setTargetOutput("");
    }
  }, []);

  const convertGregorianToPersian = useCallback((input: string) => {
    setError("");
    const res = convertG2P(input);
    if (res.ok) {
      setTargetOutput(res.value || "");
    } else {
      setError(res.error || "Date conversion error");
      setTargetOutput("");
    }
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setSourceInput(value);
    if (direction === "persian-to-gregorian") {
      convertPersianToGregorian(value);
    } else {
      convertGregorianToPersian(value);
    }
  }, [direction, convertPersianToGregorian, convertGregorianToPersian]);

  const handleClear = useCallback(() => {
    setSourceInput("");
    setTargetOutput("");
    setError("");
  }, []);

  const handleDirectionSwap = () => {
    // Swap the direction
    const newDirection =
      direction === "persian-to-gregorian"
        ? "gregorian-to-persian"
        : "persian-to-gregorian";

    setDirection(newDirection);

    // Swap the input and output
    const oldInput = sourceInput;
    const oldOutput = targetOutput;

    setSourceInput(oldOutput);
    setTargetOutput(oldInput);
    setError("");

    // Trigger conversion with swapped values
    if (oldOutput) {
      if (newDirection === "persian-to-gregorian") {
        convertPersianToGregorian(oldOutput);
      } else {
        convertGregorianToPersian(oldOutput);
      }
    }
  };

  const { isPersianDirection, sourceLabel, targetLabel, sourcePlaceholder, targetTimezone } = useMemo(() => {
    const isPersianDirection = direction === "persian-to-gregorian";
    return {
      isPersianDirection,
      sourceLabel: isPersianDirection ? "Persian Date & Time" : "Gregorian Date & Time",
      targetLabel: isPersianDirection ? "Gregorian Date & Time" : "Persian Date & Time",
      sourcePlaceholder: isPersianDirection ? "1404/05/07 00:11" : "2025/07/28 00:11",
      targetTimezone: isPersianDirection ? "(UTC+8)" : "(IRST)"
    };
  }, [direction]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ElectricBorder
        color="#ffffff"
        speed={1}
        chaos={0.5}
        thickness={2}
        style={{ borderRadius: 16 }}
      >
        {/* Apple-style Card */}
        <div className="bg-background/80 border border-border rounded-2xl shadow-xl transition-shadow duration-300 backdrop-blur-sm">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              Persian Date Converter
            </h1>
            <p className="text-foreground/80 text-sm md:text-base">
              Convert between Persian and Gregorian calendars
            </p>
          </div>

          {/* Direction Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-muted/80 p-1 rounded-xl border border-border inline-flex relative shadow-lg">
              {/* Sliding background */}
              <div
                className={cn(
                  "absolute inset-y-1 bg-primary rounded-lg shadow-md transition-transform duration-300 ease-out",
                  isPersianDirection ? "left-1 right-1/2" : "left-1/2 right-1"
                )}
              />
              <button
                onClick={handleDirectionSwap}
                className={cn(
                  "relative z-10 px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                  isPersianDirection
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Persian → Gregorian
              </button>
              <button
                onClick={handleDirectionSwap}
                className={cn(
                  "relative z-10 px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                  !isPersianDirection
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Gregorian → Persian
              </button>
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-6">
            {/* Input Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-foreground/70" />
                <span className="font-medium text-foreground">{sourceLabel}</span>
              </div>
              <div className="flex items-center gap-3">
                {(sourceInput || targetOutput) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-8 px-3 text-foreground/70 hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <div className="bg-muted/80 p-0.5 rounded-lg inline-flex border border-border relative shadow-md">
                  {/* Sliding background */}
                  <div
                    className={cn(
                      "absolute inset-y-0.5 bg-primary rounded-md shadow-sm transition-transform duration-300 ease-out",
                      inputMode === "text" ? "left-0.5 right-1/2" : "left-1/2 right-0.5"
                    )}
                  />
                  <button
                    onClick={() => setInputMode("text")}
                    className={cn(
                      "relative z-10 h-8 px-3 text-xs font-medium transition-colors duration-200 flex items-center",
                      inputMode === "text"
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Keyboard className="h-3.5 w-3.5 mr-1.5" />
                    Text
                  </button>
                  <button
                    onClick={() => setInputMode("picker")}
                    className={cn(
                      "relative z-10 h-8 px-3 text-xs font-medium transition-colors duration-200 flex items-center",
                      inputMode === "picker"
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                    Picker
                  </button>
                </div>
              </div>
            </div>

            {/* Input Controls */}
            <div className="space-y-4">
              {inputMode === "text" ? (
                <Input
                  type="text"
                  placeholder={sourcePlaceholder}
                  value={sourceInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="h-12 text-center font-mono text-lg border border-border bg-card text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded-xl placeholder:text-muted-foreground shadow-sm"
                />
              ) : (
                <div className="min-h-[3rem]">
                  {isPersianDirection ? (
                    <PersianDateTimePicker
                      value={sourceInput}
                      onChange={handleInputChange}
                      placeholder="Select Persian Date and Time"
                      className="w-full"
                    />
                  ) : (
                    <GregorianDateTimePicker
                      value={sourceInput}
                      onChange={handleInputChange}
                      placeholder="Select Gregorian Date and Time"
                      className="w-full"
                    />
                  )}
                </div>
              )}

              {!targetOutput && (
                <div className="bg-muted/50 rounded-lg p-3 text-center border border-border">
                  <p className="text-xs text-foreground/70">
                    {inputMode === "text" 
                      ? `Format: YYYY/MM/DD HH:MM • Example: ${sourcePlaceholder}`
                      : "Use the calendar picker to select date and time"
                    }
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                <p className="text-sm text-red-300 text-center">{error}</p>
              </div>
            )}

            {/* Results */}
            {targetOutput && (
              <div className="space-y-4">
                <div className="h-px bg-border"></div>
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-foreground/70">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{targetLabel}</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <p className="text-3xl font-semibold text-foreground font-mono tracking-wide">
                      {targetOutput}
                    </p>
                    <p className="text-xs text-foreground/60 mt-2">
                      {targetTimezone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </ElectricBorder>
    </div>
  );  
}
