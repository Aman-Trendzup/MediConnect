"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ShieldCheck,
  HeartPulse,
  Users,
  CheckCircle2,
  Sparkles,
  Award,
  Stethoscope,
  Building2,
  ArrowUpRight,
} from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  credentials: string;
  bio: string;
}

const LEADERSHIP_TEAM: TeamMember[] = [
  {
    name: "Dr. Aryan Sharma",
    role: "Founder & Chief Medical Officer",
    credentials: "MD, FACC • 16+ Yrs Clinical Practice",
    bio: "Former Head of Cardiology at Metro Health. Founded MediConnect to eliminate appointment queues and restore doctor-patient trust.",
  },
  {
    name: "Dr. Shalini Kapoor",
    role: "Head of Doctor Verification & Ethics",
    credentials: "MBBS, MS • Medical Council Advisor",
    bio: "Leads our rigorous administrator vetting protocol. Oversees credentials, hospital affiliations, and practice licenses.",
  },
  {
    name: "Vikram Singhania",
    role: "VP of Healthcare Technology & Security",
    credentials: "B.Tech, MS • Health Informatics",
    bio: "Architect behind MediConnect's triple-portal infrastructure. Passionate about data security, privacy, and frictionless scheduling.",
  },
  {
    name: "Meera Nair",
    role: "Director of Patient Experience & Care",
    credentials: "MHA • Patient Advocacy Specialist",
    bio: "Dedicated to transparent healthcare policies, zero-prepayment booking models, and proactive patient support.",
  },
];

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: "100% Vetted Practitioners",
    description: "Every doctor is reviewed by human administrators before ever appearing in patient search results.",
  },
  {
    icon: HeartPulse,
    title: "Zero Prepayment Barrier",
    description: "Consultation fees are purely display-only. Patients pay directly at the clinic counter with zero markups.",
  },
  {
    icon: Users,
    title: "Tri-Portal Ecosystem",
    description: "Admin, Doctor, and Patient portals work as one unified system, streamlining schedules and status logs.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      {/* Unified Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ==================== 1. HERO HEADER SECTION (MATCHING REFERENCE IMAGE 1) ==================== */}
        <section className="mb-14 sm:mb-20">
          {/* Top Tagline */}
          <div className="mb-4">
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#84b3ce]">
              We are MediConnect
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
            {/* Big Bold Headline */}
            <div className="lg:col-span-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-[#16587b] leading-[1.08]">
                We set out to build{" "}
                <span className="text-slate-400 font-extrabold block sm:inline">
                  a better way to access healthcare.
                </span>
              </h1>
            </div>

            {/* Right Subtext */}
            <div className="lg:col-span-4">
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
                Together—patients, verified specialist doctors, and clinic administrators—we are eliminating appointment delays and opaque consultation fees end-to-end.
              </p>
            </div>
          </div>

          {/* ==================== DUAL-IMAGE SHOWCASE (MATCHING REFERENCE IMAGE 1) ==================== */}
          <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Image: Medical Team */}
            <div className="md:col-span-7 h-72 sm:h-96 lg:h-[460px] rounded-[32px] overflow-hidden bg-slate-100 shadow-xl shadow-[#84b3ce]/10 relative group">
              <img
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200&auto=format&fit=crop"
                alt="MediConnect Clinical Team"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#84b3ce]" />
                  Dedicated Healthcare Team
                </span>
              </div>
            </div>

            {/* Right Image: Doctor-Patient Consultation */}
            <div className="md:col-span-5 h-72 sm:h-96 lg:h-[460px] rounded-[32px] overflow-hidden bg-slate-100 shadow-xl shadow-[#84b3ce]/10 relative group">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop"
                alt="Doctor Consultation with Digital Records"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#84b3ce]" />
                  Compassionate Direct Care
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 2. OUR STORY SECTION (MATCHING REFERENCE IMAGE 1 & 2) ==================== */}
        <section className="py-12 sm:py-20 border-t border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">

            {/* Left Headline: "Our Story ↘" */}
            <div className="lg:col-span-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#16587b] flex items-center gap-3">
                <span>Our Story</span>
                <ArrowDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-[#84b3ce] stroke-[2.5]" />
              </h2>
            </div>

            {/* Right Story Copy + Founder Quote */}
            <div className="lg:col-span-8 space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              <p>
                Our founder, <strong className="text-[#16587b] font-bold">Dr. Aryan Sharma</strong>, started MediConnect after witnessing how stressful and unpredictable scheduling a doctor consultation had become. Between inflated booking commissions, unclear consultation fees, and long queues, patient care was taking a backseat to administrative red tape.
              </p>

              <p>
                We believed there had to be a simpler, more dignified model: a shared healthcare platform where doctors could register their credentials, administrators could vet licenses for safety, and patients could browse certified profiles with complete fee transparency before stepping into a clinic.
              </p>

              <p>
                Today, MediConnect powers three connected portals: <strong>Admin Portal</strong> for institutional compliance, <strong>Doctor Portal</strong> for direct calendar and request control, and <strong>Patient Portal</strong> for instant discovery and status tracking. Every consultation fee is displayed upfront, with zero prepayment requirements.
              </p>

              {/* Founder Quote Block (Matching Reference Image 2) */}
              <div className="pt-6 mt-8 border-t border-slate-100">
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop"
                    alt="Dr. Aryan Sharma"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[#84b3ce]/40"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#16587b]">Dr. Aryan Sharma</h4>
                    <p className="text-xs text-[#84b3ce] font-semibold">Founder & Chief Medical Officer</p>
                  </div>
                </div>

                <blockquote className="text-base sm:text-lg font-medium text-[#16587b] italic border-l-4 border-[#84b3ce] pl-4 py-1">
                  &ldquo;Our goal is to build a healthcare gateway where patients find verified specialists without financial ambiguity, hidden platform markups, or impersonal waiting queues.&rdquo;
                </blockquote>
              </div>
            </div>

          </div>
        </section>

        {/* ==================== 3. THREE CORE VALUES ==================== */}
        <section className="py-12 sm:py-16 bg-slate-50/70 rounded-[36px] p-6 sm:p-10 lg:p-14 mb-20 border border-slate-100">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#84b3ce] block mb-2">
              Our Principles
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#16587b]">
              Built with purpose. Designed for patient peace of mind.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl bg-white p-7 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#84b3ce]/15 text-[#84b3ce] mb-5">
                    <Icon className="h-6 w-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#16587b] mb-2">{val.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{val.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================== 4. LEADERSHIP TEAM (MATCHING REFERENCE IMAGE 2) ==================== */}
        <section className="py-12 sm:py-16">
          {/* Centered Heading */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#16587b] leading-tight">
              Our team has over 60 years of combined healthcare experience!
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-500 font-normal">
              A multidisciplinary leadership of practicing clinicians, compliance experts, and engineers united to make medical booking seamless and transparent.
            </p>
          </div>

          {/* 4 Team Member Cards (No Profile Photos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP_TEAM.map((member, idx) => (
              <div
                key={idx}
                className="group rounded-3xl bg-white border border-slate-100 p-6 sm:p-7 shadow-lg shadow-[#84b3ce]/10 hover:shadow-2xl hover:shadow-[#84b3ce]/20 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Name & Role */}
                  <h3 className="text-lg font-black text-[#16587b] tracking-tight">{member.name}</h3>
                  <p className="text-xs font-bold text-[#84b3ce] mt-1">{member.role}</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">{member.credentials}</p>

                  {/* Bio */}
                  <p className="mt-4 text-xs text-slate-500 leading-relaxed font-normal">
                    {member.bio}
                  </p>
                </div>

                {/* Subtle verified pill */}
                <div className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#84b3ce]" />
                  <span>MediConnect Leadership</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== 5. BOTTOM CTA BANNER ==================== */}
        <section className="mt-16 sm:mt-24 rounded-[36px] bg-[#16587b] p-8 sm:p-12 lg:p-16 relative overflow-hidden text-left text-white border border-[#84b3ce]/30 shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div
            className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full blur-3xl opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(132, 179, 206, 1) 0%, rgba(255, 255, 255, 0) 70%)",
            }}
          />

          <div className="relative z-10 max-w-2xl text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#84b3ce] mb-4">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Ready for Better Healthcare?</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight text-left">
              Find Your Doctor Today With Zero Prepayment.
            </h2>
            <p className="mt-3 text-sm text-slate-200 font-normal text-left">
              Compare verified specialists, check upfront consultation fees, and reserve your clinic appointment in seconds.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-start gap-4">
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-xs font-bold text-[#16587b] hover:bg-slate-100 active:scale-95 transition-all shadow-lg cursor-pointer"
              >
                <span>Find Doctors</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-6 py-3.5 text-xs font-bold text-white hover:bg-white/15 transition-all cursor-pointer"
              >
                <span>Join as a Doctor</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
