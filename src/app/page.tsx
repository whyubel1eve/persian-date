"use client";

import { BidirectionalConverter } from "@/components/ui/bidirectional-converter";
import { DateTimeWidget } from "@/components/ui/datetime-widget";
import { MobileDateTimeWidget } from "@/components/ui/mobile-datetime-widget";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4 md:pl-8 lg:pl-16 relative">
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <BidirectionalConverter />

      {/* Desktop DateTime Widget */}
      <DateTimeWidget />

      {/* Mobile DateTime Widget */}
      <MobileDateTimeWidget />
    </div>
  );
}
