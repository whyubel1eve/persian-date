"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="w-full max-w-4xl md:max-w-3xl lg:max-w-4xl">
      <Card
        id="main-converter-card"
        className="backdrop-blur-sm border-2 shadow-xl transition-all duration-300"
      >
        <CardHeader className="text-center space-y-6 md:space-y-8 pt-8 md:pt-12 pb-8 md:pb-12 px-4 md:px-8">
          <div className="space-y-3 md:space-y-4">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl title-creative text-gradient-rainbow text-shadow-colorful leading-tight">
              Bidirectional Date & Time Converter
            </CardTitle>

            {/* Direction Toggle - Clean Design */}
            <div className="flex items-center justify-center gap-4">
              <span
                className={cn(
                  "text-base md:text-lg font-medium transition-all duration-300",
                  isPersianDirection
                    ? "text-primary"
                    : "text-muted-foreground/60"
                )}
              >
                Persian
              </span>

              <button
                onClick={handleDirectionSwap}
                className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 border-2 border-primary/30 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:scale-105"
                title="Swap conversion direction"
              >
                <ArrowRightLeft className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />

                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </button>

              <span
                className={cn(
                  "text-base md:text-lg font-medium transition-all duration-300",
                  !isPersianDirection
                    ? "text-primary"
                    : "text-muted-foreground/60"
                )}
              >
                Gregorian
              </span>
            </div>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl subtitle-modern text-muted-foreground/70 max-w-3xl mx-auto leading-relaxed px-2">
            Convert between Persian and Gregorian calendars in both directions
          </p>
        </CardHeader>

        <CardContent className="space-y-6 md:space-y-8 px-4 md:px-8 pb-8 md:pb-12">
          <div className="flex flex-col items-center space-y-6 md:space-y-8">
            {/* Source Input Section */}
            <div className="w-full max-w-2xl space-y-4 md:space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                  <label className="flex items-center gap-2 text-base md:text-lg font-semibold text-foreground">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    <span className="truncate">{sourceLabel}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Clear Button */}
                    {(sourceInput || targetOutput) && (
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClear}
                          className="gap-1.5 h-8 px-3 transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-md group"
                          title="Clear all inputs and results"
                        >
                          <X className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-200" />
                          <span className="hidden sm:inline text-xs font-medium">
                            Clear
                          </span>
                        </Button>
                      </div>
                    )}

                    {/* Mode Toggle */}
                    <div className="flex items-center gap-1 p-1 bg-muted/80 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm">
                      <Button
                        variant={inputMode === "text" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setInputMode("text")}
                        className={cn(
                          "gap-2 transition-all duration-300 relative",
                          inputMode === "text"
                            ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                            : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Keyboard className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">
                          Text
                        </span>
                      </Button>
                      <Button
                        variant={inputMode === "picker" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setInputMode("picker")}
                        className={cn(
                          "gap-2 transition-all duration-300 relative",
                          inputMode === "picker"
                            ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                            : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <CalendarDays className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium">
                          Picker
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Input Mode Switch with Animation */}
                <div className="relative h-16">
                  <div
                    className={`transition-all duration-300 absolute inset-0 ${
                      inputMode === "text"
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder={sourcePlaceholder}
                        value={sourceInput}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="text-xl text-center h-16 font-mono tracking-wider border-2 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all duration-200 placeholder:text-muted-foreground/40 placeholder:font-normal px-4"
                      />
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Keyboard className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-300 absolute inset-0 ${
                      inputMode === "picker"
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
                  >
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
                </div>

                {!targetOutput && (
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <p className="text-sm text-muted-foreground text-center">
                      {inputMode === "text" ? (
                        <>
                          <span className="font-semibold">Format:</span>{" "}
                          YYYY/MM/DD HH:MM |
                          <span className="text-primary"> Time optional</span>,
                          defaults to 00:00{sourceTimezone}
                        </>
                      ) : (
                        <>
                          <span className="font-semibold">
                            Click to open picker
                          </span>{" "}
                          | Select date and time using the calendar
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      {inputMode === "text"
                        ? `Example: ${sourcePlaceholder} or simply ${
                            sourcePlaceholder.split(" ")[0]
                          }`
                        : "You can switch to text mode for manual input"}
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

            {/* Conversion Divider */}
            {targetOutput && (
              <div className="flex justify-center">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-border"></div>
                  <div className="text-sm font-medium px-3 py-1 bg-muted/50 rounded-full border">
                    Converted
                  </div>
                  <div className="h-px w-24 bg-gradient-to-l from-transparent via-border to-border"></div>
                </div>
              </div>
            )}

            {/* Target Output Section */}
            {targetOutput && (
              <div className="w-full max-w-2xl">
                <Card className="bg-gradient-to-br from-primary/5 via-primary/3 to-primary/5 border-primary/20 border-2 shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      {/* Source Input Display */}
                      <div className="space-y-2 pb-4 border-b border-border/50">
                        <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4" />
                          {sourceLabel}
                        </p>
                        <p className="text-2xl font-mono text-foreground/80">
                          {sourceInput}{" "}
                          <span className="text-sm text-muted-foreground">
                            {sourceTimezone}
                          </span>
                        </p>
                      </div>

                      {/* Target Result */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          {targetLabel}
                        </h3>
                        <p className="text-4xl font-bold text-primary font-mono tracking-wider">
                          {targetOutput}
                        </p>
                        <p className="text-base text-muted-foreground">
                          <span className="text-sm text-muted-foreground">
                            {targetTimezone}
                          </span>
                          {" | "}
                          Converted from{" "}
                          {isPersianDirection
                            ? "Persian (IRST)"
                            : "Gregorian (UTC+8)"}{" "}
                          to{" "}
                          {isPersianDirection
                            ? "Gregorian (UTC+8)"
                            : "Persian (IRST)"}
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
  );
}
