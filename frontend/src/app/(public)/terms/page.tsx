"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  Clock,
  CheckCircle2,
  Lock,
  Mail,
} from "lucide-react";

interface Section {
  id: string;
  title: string;
}

const SECTIONS: Section[] = [
  { id: "acceptance", title: "Acceptance of terms & platform scope" },
  { id: "medical-disclaimer", title: "Important healthcare & emergency disclaimer" },
  { id: "doctor-obligations", title: "Doctor verification & professional conduct" },
  { id: "booking-rules", title: "Appointment booking, status & cancellations" },
  { id: "fee-policy", title: "Direct clinic settlement & fee transparency" },
  { id: "user-accounts", title: "Account security & portal responsibilities" },
  { id: "intellectual-property", title: "Intellectual property & acceptable use" },
  { id: "limitation-of-liability", title: "Limitation of liability" },
  { id: "legal-contact", title: "Governing law & legal contact" },
];

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState<string>("acceptance");

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      {/* Standard Container Layout across all sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="mb-12 border-b border-slate-100 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#84b3ce]/15 px-3.5 py-1 text-xs font-semibold text-[#16587b] mb-3">
            <FileText className="h-3.5 w-3.5 text-[#84b3ce]" />
            <span>Terms of Service Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#16587b]">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last updated: November 2026 • MediConnect Health Systems
          </p>
        </div>

        {/* 2-Column Responsive Layout Matching Reference Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* ==================== LEFT SIDEBAR: TABLE OF CONTENTS ==================== */}
          <aside className="lg:col-span-4 sticky top-28 hidden lg:block">
            <div className="rounded-3xl bg-slate-50/70 border border-slate-200/80 p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Table of Contents
              </h3>
              
              <nav className="flex flex-col space-y-3">
                {SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`text-left text-xs font-semibold transition-all py-1.5 px-2 rounded-xl cursor-pointer relative ${
                        isActive
                          ? "text-[#16587b] font-bold bg-white shadow-xs border border-slate-200/60"
                          : "text-slate-500 hover:text-[#16587b]"
                      }`}
                    >
                      <span className="line-clamp-2">{sec.title}</span>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 bg-[#84b3ce] rounded-r-full" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* ==================== RIGHT MAIN CONTENT ==================== */}
          <main className="lg:col-span-8 space-y-12">
            
            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Acceptance of terms & platform scope
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Welcome to MediConnect. These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the MediConnect website, application programming interfaces, and three associated portal services: the <strong>Patient Portal</strong>, the <strong>Doctor Portal</strong>, and the <strong>Admin Portal</strong>.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3">
                By accessing or registering an account on MediConnect, you agree to comply with and be legally bound by these Terms. If you do not agree, you must refrain from using the platform.
              </p>
            </section>

            {/* Section 2 */}
            <section id="medical-disclaimer" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#181818] mb-4">
                Important healthcare & emergency disclaimer
              </h2>
              <div className="rounded-3xl bg-rose-50/80 border border-rose-200 p-6 sm:p-7">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                    <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-rose-900">
                      MediConnect Is NOT for Medical Emergencies
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-rose-700 leading-relaxed">
                      If you are experiencing a life-threatening emergency, severe trauma, acute cardiac symptoms, or urgent distress, please immediately call your national emergency service (112 / 108) or go to the nearest hospital casualty emergency room.
                    </p>
                    <p className="mt-2 text-xs sm:text-sm text-rose-700 leading-relaxed">
                      MediConnect is an online facilitator that helps patients discover verified doctors and schedule clinic consultations. MediConnect itself is not a hospital and does not provide direct medical diagnoses or emergency medical treatment.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="doctor-obligations" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Doctor verification & professional conduct
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Healthcare practitioners submitting a <strong>Doctor Application</strong> agree to the following institutional standards:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600">
                <li>All medical degrees, state council licenses, and certificates uploaded for verification must be genuine, accurate, and actively maintained.</li>
                <li>Practitioners must maintain accurate clinic addresses and current schedule slots in their Doctor Portal.</li>
                <li>Applications are subject to administrator approval. MediConnect reserves the right to suspend or reject any application that fails verification or ethical standards.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="booking-rules" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Appointment booking, status & cancellations
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Patients can reserve open slots across multiple medical specialties. When booking an appointment:
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-[#16587b] mb-1">Status Notifications</h4>
                  <p className="text-slate-500">Bookings are marked as &ldquo;Pending&rdquo; until reviewed by the doctor, after which you receive an immediate status update.</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-[#16587b] mb-1">Cancellation Etiquette</h4>
                  <p className="text-slate-500">Patients may cancel bookings without penalty. We ask that cancellations be made at least 2 hours prior to allow other patients access.</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="fee-policy" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Direct clinic settlement & fee transparency
              </h2>
              <div className="rounded-3xl bg-[#84b3ce]/10 border border-[#84b3ce]/30 p-6 sm:p-7">
                <h3 className="text-base font-bold text-[#16587b] mb-2">
                  No Payment Processing • Pay In-Person
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  All consultation fees shown on MediConnect are set directly by doctors and clinic institutions for informational transparency. MediConnect charges patients <strong>zero platform fees</strong> for booking.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                  Payment takes place strictly at the physical clinic counter during your in-person visit. MediConnect has no responsibility or liability for clinic counter transactions or refunds.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="user-accounts" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Account security & portal responsibilities
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Users are responsible for safeguarding their login credentials. Do not share your password or authentication sessions. If you suspect unauthorized access to your patient or doctor portal, notify our support team immediately.
              </p>
            </section>

            {/* Section 7 */}
            <section id="intellectual-property" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Intellectual property & acceptable use
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The visual layout, design components, branding, logos, and portal architecture are the exclusive intellectual property of MediConnect Health Systems. Scraping doctor profiles or unauthorized API extraction is strictly prohibited.
              </p>
            </section>

            {/* Section 8 */}
            <section id="limitation-of-liability" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Limitation of liability
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The doctor-patient relationship is formed directly between the patient and the independent healthcare provider. MediConnect does not supervise, diagnose, or dictate the medical advice, diagnosis, or treatments provided by registered doctors.
              </p>
            </section>

            {/* Section 9 */}
            <section id="legal-contact" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Governing law & legal contact
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of India. For legal notices or regulatory questions:
              </p>

              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-2 text-xs sm:text-sm text-slate-700">
                <p><strong>MediConnect Health Systems Legal Counsel</strong></p>
                <p>Email: <a href="mailto:legal@mediconnect.com" className="text-[#84b3ce] font-bold hover:underline">legal@mediconnect.com</a></p>
                <p>Corporate Office: MediConnect Health Systems, Bandra Kurla Complex, Mumbai, Maharashtra 400051</p>
              </div>
            </section>

          </main>

        </div>

      </div>
    </div>
  );
}

