"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  BriefcaseMedical,
  Clock,
  Stethoscope,
  ArrowUpRight,
  ShieldCheck,
  HeartPulse,
  Sparkles,
} from "lucide-react";

/**
 * Standard container layout shared across all sections:
 * "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#e2f1f8] via-[#eef6fa] to-white -mt-20 sm:-mt-24 min-h-screen flex flex-col justify-center pt-28 sm:pt-32 lg:pt-36 pb-24 sm:pb-28 lg:pb-32">
      {/* Background Ambient Glows & Accents */}
      <div
        className="pointer-events-none absolute -top-24 right-1/4 h-[520px] w-[520px] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(132, 179, 206, 0.7) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-1/3 -left-20 h-96 w-96 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(132, 179, 206, 0.5) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />

      {/* Standard Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[620px]">
          
          {/* ==================== LEFT COLUMN: CONTENT ==================== */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 border border-white/80 shadow-sm text-xs font-semibold tracking-wide text-[#16587b] mb-6">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#84b3ce]/20 text-[#84b3ce]">
                <Activity className="h-3.5 w-3.5 stroke-[2.5]" />
              </span>
              <span>Fast & Verified Healthcare</span>
            </div>

            {/* Main Headline with Integrated Visual Stethoscope Accent */}
            <div className="relative">
              <h1 className="text-6xl sm:text-7xl lg:text-[82px] font-black tracking-tight text-[#16587b] leading-[0.95] uppercase">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#16587b] to-[#16587b]/90">
                  Quick
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#84b3ce] to-[#5a97b9]">
                  Smart
                </span>
                <span className="block text-[#16587b]">
                  Medic
                </span>
              </h1>

              {/* Decorative Stethoscope Floating Badge / Accent */}
              <div className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 items-center justify-center w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-md border border-[#84b3ce]/40 shadow-lg shadow-[#84b3ce]/15 rotate-6 hover:rotate-0 transition-transform duration-300">
                <Stethoscope className="w-8 h-8 text-[#84b3ce]" />
              </div>
            </div>

            {/* Strategic Senior Copy */}
            <p className="mt-7 text-base sm:text-lg text-slate-600 max-w-md leading-relaxed font-normal">
              <span className="font-semibold text-[#16587b]">MediConnect</span> is your destination for world-class treatments,{" "}
              <strong className="font-semibold text-[#16587b]">verified specialist doctors</strong>, and direct schedule booking all under one seamless roof.
            </p>

            {/* CTA Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/doctors"
                className="group relative inline-flex items-center gap-4 rounded-full bg-[#16587b] px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#16587b]/25 hover:bg-[#124561] active:scale-[0.99] transition-all duration-200"
              >
                <span>Find Doctors</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#16587b] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </span>
              </Link>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 pl-2">
                <ShieldCheck className="w-4 h-4 text-[#84b3ce]" />
                <span>100% Free Booking • No Hidden Fees</span>
              </div>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: ARCH & MEDICAL COMPOSITION ==================== */}
          <div className="lg:col-span-7 relative flex justify-center items-center">
            
            {/* Visual Container Frame */}
            <div className="relative w-full max-w-[560px] flex items-end justify-center">

              {/* Central Doctor Portrait Arch */}
              <div className="relative z-10 w-[270px] sm:w-[320px] md:w-[340px] aspect-[1/1.3] rounded-t-[160px] sm:rounded-t-[190px] rounded-b-[40px] overflow-hidden bg-gradient-to-b from-[#d9ebf5] via-[#eef6fa] to-white border-4 border-white shadow-2xl shadow-[#84b3ce]/20">
                <img
                  src="https://images.unsplash.com/photo-1594824813622-c3a504b86c2e?q=80&w=900&auto=format&fit=crop"
                  alt="Specialist Doctor MediConnect"
                  className="w-full h-full object-cover object-top scale-105 transition-transform duration-700 hover:scale-110"
                  loading="eager"
                />
                
                {/* Inner soft lighting vignette */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
              </div>

              {/* Right Side Anatomical / High-Tech Organ Illustration Card */}
              <div className="hidden sm:block absolute right-0 bottom-4 z-10 w-[180px] sm:w-[220px] md:w-[240px] aspect-[1/1.3] rounded-t-[120px] rounded-b-[36px] bg-gradient-to-b from-white/80 via-[#f0f8fd]/90 to-white/70 backdrop-blur-md border-2 border-white shadow-xl shadow-[#84b3ce]/15 overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop"
                    alt="Advanced Clinical Diagnostics"
                    className="w-full h-full object-cover rounded-t-[100px] rounded-b-[24px] opacity-90 mix-blend-multiply"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#84b3ce]/30 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Small Floating Micro-Tag */}
                  <div className="absolute bottom-3 left-3 right-3 py-1.5 px-2 rounded-xl bg-white/95 backdrop-blur-sm text-center border border-white/80 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#16587b] flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#84b3ce]" />
                      Smart Diagnostics
                    </span>
                  </div>
                </div>
              </div>

              {/* ==================== FLOATING GLASSMORPHIC STAT BADGES ==================== */}

              {/* Badge 1: Vertical Award Badge (Top Center-Right) */}
              <div className="absolute -top-4 sm:-top-8 left-[45%] sm:left-[48%] z-20 flex flex-col items-center justify-center rounded-2xl bg-white/95 backdrop-blur-md px-3.5 py-3 border border-white shadow-xl shadow-[#84b3ce]/20 min-w-[76px] transition-transform duration-300 hover:-translate-y-1">
                <span className="text-base font-black tracking-tight text-[#16587b]">
                  490+
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#84b3ce]">
                  AWARDS
                </span>
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#84b3ce]/15 text-[#84b3ce]">
                  <Award className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Stacked Cards Top-Right */}
              <div className="absolute -top-2 -right-2 sm:-right-4 z-20 flex flex-col gap-2.5">
                {/* Badge 2: Years Medical Excellence */}
                <div className="flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md px-4 py-2.5 border border-white shadow-lg shadow-black/5 hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#84b3ce]/20 text-[#84b3ce]">
                    <BriefcaseMedical className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#16587b] leading-tight">
                      22+ Years
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Medical Excellence
                    </p>
                  </div>
                </div>

                {/* Badge 3: Verified Outcomes */}
                <div className="flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md px-4 py-2.5 border border-white shadow-lg shadow-black/5 hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#84b3ce]/20 text-[#84b3ce]">
                    <HeartPulse className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#16587b] leading-tight">
                      6,700+
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Healed Patients
                    </p>
                  </div>
                </div>
              </div>

              {/* Badge 4: Dual Capsule Pill Across Bottom Base */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] sm:w-auto">
                <div className="flex items-center justify-between sm:justify-center gap-4 sm:gap-6 rounded-full bg-white/95 backdrop-blur-md px-5 py-3 border border-white shadow-xl shadow-[#84b3ce]/25">
                  {/* Left Pill Item */}
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#84b3ce]/20 text-[#84b3ce]">
                      <Stethoscope className="h-4 w-4" />
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#16587b] leading-tight">
                        120+
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Expert Doctors
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-6 w-[1px] bg-slate-200" />

                  {/* Right Pill Item */}
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#16587b]/10 text-[#16587b]">
                      <Clock className="h-4 w-4" />
                    </span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#16587b] leading-tight">
                        24/7
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Easy Booking
                      </p>
                    </div>
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
