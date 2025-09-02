"use client";

import { BidirectionalConverter } from "@/components/ui/bidirectional-converter";
import { DateTimeWidget } from "@/components/ui/datetime-widget";
import { MobileDateTimeWidget } from "@/components/ui/mobile-datetime-widget";

export default function PersianDateConverterPage() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4 md:pl-8 lg:pl-16 overflow-hidden">
      <BidirectionalConverter />

      {/* Desktop DateTime Widget */}
      <DateTimeWidget />

      {/* Mobile DateTime Widget */}
      <MobileDateTimeWidget />
    </div>
  );
}