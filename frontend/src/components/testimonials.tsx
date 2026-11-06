"use client";

import React, { useState } from "react";
import {
  Star,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Quote,
  Sparkles,
} from "lucide-react";

export const TESTIMONIALS = [
  {
    id: "test-1",
    author: "Rohan Mukherjee",
    role: "Verified Patient",
    treatment: "Consulted Dr. Sarah Jenkins (Cardiology)",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    quote:
      "Finding a trusted cardiologist on short notice was always stressful. With MediConnect, I booked an afternoon slot in 2 minutes and knew the consultation fee upfront. No surprise clinic charges!",
  },
  {
    id: "test-2",
    author: "Deepika Sharma",
    role: "Mother of 2",
    treatment: "Consulted Dr. Marcus Chen (Pediatrics)",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    quote:
      "The best part is real-time status updates. The doctor accepted my evening slot immediately. Paying directly at the counter without putting credit card details online gave me complete peace of mind.",
  },
  {
    id: "test-3",
    author: "Amitabh Sen",
    role: "Senior Citizen",
    treatment: "Consulted Dr. Priya Varma (Orthopedics)",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    quote:
      "My knee surgery follow-up was smooth and dignified. The doctor’s credentials and past clinic affiliations were verified by the admin portal. Highly recommend MediConnect to every family.",
  },
  {
    id: "test-4",
    author: "Sneha Patel",
    role: "Working Professional",
    treatment: "Consulted Dr. Ananya Roy (Neurology)",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    quote:
      "I had frequent migraine episodes. Booking a weekend slot through MediConnect was instantaneous. The transparent fee display meant no hidden consultation surcharges.",
  },
];

export default function TestimonialsSection() {
  const [startIndex, setStartIndex] = useState(0);

  // Responsive: On desktop we show 2 cards at a time; on mobile we slide 1 by 1
  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Get current active cards wrapping seamlessly around the array
  const currentCard1 = TESTIMONIALS[startIndex];
  const currentCard2 = TESTIMONIALS[(startIndex + 1) % TESTIMONIALS.length];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      {/* Standard Container Layout across all sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ==================== LEFT COLUMN: HEADER & WORKING CONTROLS ==================== */}
          <div className="lg:col-span-4 relative flex flex-col justify-between">
            {/* Giant Background Quote Watermark (Matching Reference Image 2) */}
            <div className="pointer-events-none absolute -top-14 -left-6 opacity-10 text-[#84b3ce]">
              <Quote className="w-36 h-36" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#84b3ce]/15 px-3.5 py-1 text-xs font-semibold text-[#16587b] mb-4">
                <Sparkles className="h-3.5 w-3.5 text-[#84b3ce]" />
                <span>Patient Stories</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#16587b] leading-tight">
                Patients Love{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16587b] to-[#84b3ce]">
                  MediConnect.
                </span>
              </h2>

              <p className="mt-4 text-base text-slate-500 font-normal leading-relaxed">
                Over 12,000 appointments fulfilled with zero booking fees, verified specialists, and genuine clinical care.
              </p>

              {/* Functional Navigation Buttons with Active State Indicators */}
              <div className="flex items-center gap-3 mt-8">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous Testimonials"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-[#16587b] shadow-sm hover:border-[#84b3ce] hover:bg-slate-50 active:scale-90 transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next Testimonials"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#16587b] text-white shadow-md hover:bg-[#124561] active:scale-90 transition-all cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>

                {/* Counter indicator */}
                <span className="text-xs font-bold text-slate-400 ml-2">
                  {startIndex + 1} / {TESTIMONIALS.length}
                </span>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: FLUID WAVE BACKDROP + WORKING CARDS ==================== */}
          <div className="lg:col-span-8 relative">
            {/* Fluid Medical Cyan Backdrop */}
            <div className="relative rounded-[36px] bg-gradient-to-br from-[#84b3ce] via-[#6d9fb8] to-[#5087a3] p-6 sm:p-10 shadow-2xl shadow-[#84b3ce]/30 overflow-hidden">
              
              {/* Subtle ambient lighting inside backdrop */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25)_0%,transparent_60%)]" />

              {/* Dynamic Testimonials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                
                {/* Card 1 (Always Visible) */}
                <div
                  key={currentCard1.id}
                  className="flex flex-col justify-between rounded-3xl bg-white p-7 shadow-xl shadow-black/10 transition-all duration-300 transform animate-fadeIn"
                >
                  <div>
                    {/* Top Row: Avatar + Name + Verified Badge */}
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className="relative shrink-0">
                        <img
                          src={currentCard1.avatar}
                          alt={currentCard1.author}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-[#84b3ce]/40"
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#84b3ce] text-white text-[9px]">
                          <ShieldCheck className="h-2.5 w-2.5" />
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#16587b] leading-tight">
                          {currentCard1.author}
                        </h4>
                        <span className="text-[11px] font-semibold text-[#84b3ce]">
                          {currentCard1.role}
                        </span>
                      </div>
                    </div>

                    {/* 5-Star Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(currentCard1.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {/* Quote Text */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      "{currentCard1.quote}"
                    </p>
                  </div>

                  {/* Bottom Treatment Tag */}
                  <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="truncate">{currentCard1.treatment}</span>
                  </div>
                </div>

                {/* Card 2 (Visible on md and up, slides with Card 1) */}
                <div
                  key={currentCard2.id}
                  className="hidden md:flex flex-col justify-between rounded-3xl bg-white p-7 shadow-xl shadow-black/10 transition-all duration-300 transform animate-fadeIn"
                >
                  <div>
                    {/* Top Row: Avatar + Name + Verified Badge */}
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className="relative shrink-0">
                        <img
                          src={currentCard2.avatar}
                          alt={currentCard2.author}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-[#84b3ce]/40"
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#84b3ce] text-white text-[9px]">
                          <ShieldCheck className="h-2.5 w-2.5" />
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#16587b] leading-tight">
                          {currentCard2.author}
                        </h4>
                        <span className="text-[11px] font-semibold text-[#84b3ce]">
                          {currentCard2.role}
                        </span>
                      </div>
                    </div>

                    {/* 5-Star Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(currentCard2.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {/* Quote Text */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      "{currentCard2.quote}"
                    </p>
                  </div>

                  {/* Bottom Treatment Tag */}
                  <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="truncate">{currentCard2.treatment}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
