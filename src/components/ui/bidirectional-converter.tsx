"use client";

import { useState } from "react";
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
  ArrowRightLeft,
  Calendar,
  Clock,
} from "lucide-react";
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

  const convertPersianToGregorian = (input: string) => {
    setError("");
    const res = convertP2G(input);
    if (res.ok) {
      setTargetOutput(res.value || "");
    } else {
      setError(res.error || "Date conversion error");
      setTargetOutput("");
    }
  };

  const convertGregorianToPersian = (input: string) => {
    setError("");
    const res = convertG2P(input);
    if (res.ok) {
      setTargetOutput(res.value || "");
    } else {
      setError(res.error || "Date conversion error");
      setTargetOutput("");
    }
  };

  const handleInputChange = (value: string) => {
    setSourceInput(value);
    if (direction === "persian-to-gregorian") {
      convertPersianToGregorian(value);
    } else {
      convertGregorianToPersian(value);
    }
  };

  const handleClear = () => {
    setSourceInput("");
    setTargetOutput("");
    setError("");
  };

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

  const isPersianDirection = direction === "persian-to-gregorian";
  const sourceLabel = isPersianDirection
    ? "Persian Date & Time"
    : "Gregorian Date & Time";
  const targetLabel = isPersianDirection
    ? "Gregorian Date & Time"
    : "Persian Date & Time";
  const sourcePlaceholder = isPersianDirection
    ? "1404/05/07 00:11"
    : "2025/07/28 00:11";
  const sourceTimezone = isPersianDirection ? "(IRST)" : "(UTC+8)";
  const targetTimezone = isPersianDirection ? "(UTC+8)" : "(IRST)";

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Apple-style Card */}
      <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              Persian Date Converter
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Convert between Persian and Gregorian calendars
            </p>
          </div>

          {/* Direction Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-muted/50 p-1 rounded-xl border border-border/30 inline-flex">
              <button
                onClick={handleDirectionSwap}
                className={cn(
                  "px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isPersianDirection
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Persian → Gregorian
              </button>
              <button
                onClick={handleDirectionSwap}
                className={cn(
                  "px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  !isPersianDirection
                    ? "bg-primary text-primary-foreground shadow-sm"
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
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{sourceLabel}</span>
              </div>
              <div className="flex items-center gap-3">
                {(sourceInput || targetOutput) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-8 px-3 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <div className="bg-muted/30 p-0.5 rounded-lg inline-flex border">
                  <Button
                    variant={inputMode === "text" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setInputMode("text")}
                    className="h-8 px-3 text-xs"
                  >
                    <Keyboard className="h-3.5 w-3.5 mr-1.5" />
                    Text
                  </Button>
                  <Button
                    variant={inputMode === "picker" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setInputMode("picker")}
                    className="h-8 px-3 text-xs"
                  >
                    <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                    Picker
                  </Button>
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
                  className="h-12 text-center font-mono text-lg border-0 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl placeholder:text-muted-foreground/60"
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
                <div className="bg-muted/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    {inputMode === "text" 
                      ? `Format: YYYY/MM/DD HH:MM • Example: ${sourcePlaceholder}`
                      : "Use the calendar picker to select date and time"
                    }
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

            {/* Results */}
            {targetOutput && (
              <div className="space-y-4">
                <div className="h-px bg-border/30"></div>
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{targetLabel}</span>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
                    <p className="text-3xl font-semibold text-primary font-mono tracking-wide">
                      {targetOutput}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {targetTimezone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );  
}
