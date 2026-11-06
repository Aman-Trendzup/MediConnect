"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowUpRight,
  Stethoscope,
} from "lucide-react";

export default function DoctorRecruitmentSection() {
  return (
    <section className="py-16 lg:py-24 bg-white relative">
      {/* Standard Container Layout across all sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Sleek Dark Container (bg-[#16587b]) with Glowing Edges in #84b3ce */}
        <div className="relative rounded-[36px] bg-[#16587b] p-8 sm:p-12 lg:p-16 overflow-hidden border border-[#84b3ce]/30 shadow-2xl shadow-[#16587b]/30">

          {/* Subtle Ambient Radial Glows inside dark card */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(132, 179, 206, 1) 0%, rgba(255, 255, 255, 0) 70%)",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-15"
            style={{
              background:
                "radial-gradient(circle, rgba(132, 179, 206, 0.8) 0%, rgba(255, 255, 255, 0) 70%)",
            }}
          />

          {/* Left Aligned Content */}
          <div className="relative z-10 max-w-3xl text-left">

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#84b3ce] mb-4">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor Partnership Program</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight text-left">
              Grow Your Practice With{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#84b3ce] to-[#a2cbdf]">
                MediConnect.
              </span>
            </h2>

            {/* Body */}
            <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed text-left">
              Manage your patient calendar, accept new appointment requests, and streamline your clinic hours with our dedicated Doctor Portal.
            </p>

            {/* 3 Pillars for Doctors - Left Aligned */}
            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-8 text-left">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-[#84b3ce] shrink-0" />
                <span>Real-time Slot Control</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-[#84b3ce] shrink-0" />
                <span>Direct Patient Intake</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-[#84b3ce] shrink-0" />
                <span>Zero Commission On Fees</span>
              </div>
            </div>

            {/* Action Button - Left Aligned */}
            <div className="mt-8 flex justify-start">
              <Link
                href="/doctor/register"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#16587b] shadow-xl hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              >
                <span>Register as a Doctor</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#16587b] text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                </span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
