"use client";

import { BidirectionalConverter } from "@/components/ui/bidirectional-converter";
import { DateTimeWidget } from "@/components/ui/datetime-widget";
import { MobileDateTimeWidget } from "@/components/ui/mobile-datetime-widget";
import Prism from "@/components/Prism";

export default function PersianDateConverterPage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4 md:pl-8 lg:pl-16 overflow-hidden relative">
      {/* Prism Background - extends to full viewport including navigation */}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <Prism
          animationType="rotate"
          timeScale={0.15}
          height={5}
          baseWidth={5.0}
          scale={3.2}
          hueShift={0}
          colorFrequency={0.8}
          noise={0}
          glow={0.3}
          suspendWhenOffscreen={true}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <BidirectionalConverter />
      </div>

      {/* Desktop DateTime Widget */}
      <div className="relative z-10">
        <DateTimeWidget />
      </div>

      {/* Mobile DateTime Widget */}
      <div className="relative z-10">
        <MobileDateTimeWidget />
      </div>
    </div>
  );
}
