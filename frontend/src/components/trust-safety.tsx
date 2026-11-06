"use client";

import React from "react";
import {
  ShieldCheck,
  Receipt,
  WalletCards,
  Radio,
  Building2,
  Lock,
} from "lucide-react";

/**
 * Trust & Safety Pillars + Certified Standards
 * Infinite Right-to-Left Ticker WITHOUT any surrounding card/boxes
 * (Clean text, icons, and badges like the brand logo ticker in Reference Image 1)
 */
const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "100% Verified Credentials",
    tag: "Admin Approved",
  },
  {
    icon: Receipt,
    title: "Transparent Display Fees",
    tag: "No Hidden Costs",
  },
  {
    icon: WalletCards,
    title: "No Prepayment Required",
    tag: "Pay at Clinic",
  },
  {
    icon: Radio,
    title: "Live Status Tracking",
    tag: "Instant Alerts",
  },
  {
    icon: Building2,
    title: "50+ Partner Clinics",
    tag: "Accredited Centers",
  },
  {
    icon: Lock,
    title: "Strict Health Privacy",
    tag: "HIPAA Compliant",
  },
];

export default function TrustSection() {
  // Duplicate array for seamless infinite marquee loop
  const marqueeItems = [...TRUST_ITEMS, ...TRUST_ITEMS];

  return (
    <section className="py-8 bg-transparent overflow-hidden border-y border-slate-100">
      {/* Small top label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Trusted by over 45,000+ patients & verified practitioners
        </p>
      </div>

      {/* Infinite Right-to-Left Marquee Container (No Boxes) */}
      <div className="relative w-full overflow-hidden">
        {/* Subtle left & right gradient fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        <div className="animate-marquee flex items-center gap-10 sm:gap-14">
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 shrink-0 cursor-default group"
              >
                {/* Minimal Icon without box */}
                <Icon className="h-5 w-5 text-[#84b3ce] transition-transform duration-300 group-hover:scale-110" />
                
                {/* Text Title */}
                <span className="text-sm sm:text-base font-bold text-[#16587b] tracking-tight whitespace-nowrap">
                  {item.title}
                </span>

                {/* Subtle Pill Tag */}
                <span className="inline-flex items-center rounded-full bg-[#84b3ce]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#16587b] whitespace-nowrap">
                  {item.tag}
                </span>

                {/* Dot separator */}
                <span className="ml-5 h-1.5 w-1.5 rounded-full bg-slate-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
