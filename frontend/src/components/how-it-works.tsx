"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  CalendarCheck,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  UserCheck,
} from "lucide-react";

interface StepItem {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
}

const STEPS: StepItem[] = [
  {
    id: "step-1",
    stepNumber: "01",
    title: "Find Your Doctor",
    subtitle: "Precision Search & Smart Filters",
    description:
      "Explore verified healthcare practitioners filtered by medical specialty, patient ratings, clinic location, and transparent consultation fees.",
    icon: Search,
    badge: "Verified Profiles",
    bgGradient: "from-[#eef6fa] to-[#d8ebf5]",
    borderColor: "border-[#84b3ce]/40",
    accentColor: "#84b3ce",
  },
  {
    id: "step-2",
    stepNumber: "02",
    title: "Select Date & Slot",
    subtitle: "Real-time Live Calendar",
    description:
      "View actual doctor availability. Pick morning, afternoon, or evening slots that fit smoothly into your personal schedule without waiting on call.",
    icon: CalendarCheck,
    badge: "Live Calendar",
    bgGradient: "from-[#f4f7fc] to-[#e6ecf8]",
    borderColor: "border-indigo-100",
    accentColor: "#6366f1",
  },
  {
    id: "step-3",
    stepNumber: "03",
    title: "Instant Confirmation",
    subtitle: "Zero Advance Payments",
    description:
      "Get immediate booking confirmation with your digital appointment pass. No payment gateway hassle—consultation fees are settled directly at the clinic.",
    icon: ShieldCheck,
    badge: "Pay At Clinic",
    bgGradient: "from-[#f3f9f6] to-[#dff1e7]",
    borderColor: "border-emerald-100",
    accentColor: "#10b981",
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through the cards sequentially (Card stacking effect)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 4000); // Transitions every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % STEPS.length);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + STEPS.length) % STEPS.length);
  };

  return (
    <section
      className="py-16 lg:py-24 bg-gradient-to-b from-white via-[#f7fafc] to-white relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Unified Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#84b3ce]/15 px-3.5 py-1 text-xs font-semibold text-[#16587b] mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#84b3ce]" />
              <span>Simple 3-Step Journey</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#16587b] leading-tight">
              Discover How It Works.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16587b] to-[#84b3ce]">
                Care in 3 Easy Steps.
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-500 font-normal">
              Eliminate appointment delays. Find, verify, and reserve your doctor consultation in under 60 seconds.
            </p>
          </div>

          {/* Carousel Arrow Controls (Matches Reference Image 1) */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={handlePrev}
              aria-label="Previous step"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16587b] text-white shadow-md hover:bg-[#124561] active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next step"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16587b] text-white shadow-md hover:bg-[#124561] active:scale-95 transition-all cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ==================== STACKING CARDS CONTAINER ==================== */}
        {/* Desktop: 3 Grid Columns that highlight active step; Mobile: Animated Stack Carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCurrent = activeStep === index;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`group relative rounded-3xl p-7 sm:p-8 cursor-pointer transition-all duration-500 flex flex-col justify-between border ${
                  step.borderColor
                } ${
                  isCurrent
                    ? `bg-gradient-to-br ${step.bgGradient} shadow-2xl shadow-[#84b3ce]/20 -translate-y-2 ring-2 ring-[#84b3ce]/50`
                    : "bg-white/90 hover:bg-slate-50/80 shadow-md hover:-translate-y-1 opacity-85 hover:opacity-100"
                }`}
              >
                {/* Top Row: Number Badge (Hand-drawn / Circular Style) & Category Tag */}
                <div className="flex items-start justify-between">
                  {/* Circular Step Pill */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-base font-black transition-all duration-300 ${
                      isCurrent
                        ? "bg-[#16587b] text-white border-[#16587b] shadow-md"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    {step.stepNumber}
                  </div>

                  {/* Micro Pill Badge */}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-xs px-3 py-1 text-xs font-bold text-[#16587b] border border-white/60 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#84b3ce]" />
                    {step.badge}
                  </span>
                </div>

                {/* Body Content */}
                <div className="my-8">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#16587b]">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {step.subtitle}
                  </p>
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Footer Accent Icon & Active Indicator */}
                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#16587b]">
                    <Icon className="w-4 h-4 text-[#84b3ce]" />
                    <span>Step {index + 1} of 3</span>
                  </div>

                  {/* Step Progress Line */}
                  <div className="flex items-center gap-1.5">
                    {STEPS.map((_, dotIndex) => (
                      <span
                        key={dotIndex}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          dotIndex === index
                            ? "w-6 bg-[#16587b]"
                            : "w-2 bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Subtle Active Glow bar */}
                {isCurrent && (
                  <div className="absolute inset-x-8 -bottom-1 h-1 bg-[#84b3ce] rounded-full blur-xs" />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Connecting Progress bar for Desktop */}
        <div className="mt-8 hidden lg:flex items-center justify-center gap-3">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeStep === i ? "w-12 bg-[#84b3ce]" : "w-3 bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

