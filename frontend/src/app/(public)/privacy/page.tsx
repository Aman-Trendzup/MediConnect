"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Server,
  Mail,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface Section {
  id: string;
  title: string;
}

const SECTIONS: Section[] = [
  { id: "types-of-info", title: "Types of information we collect online" },
  { id: "no-financial-data", title: "Financial & fee policy (No payment gateway)" },
  { id: "automatic-info", title: "Information collected automatically" },
  { id: "how-we-use", title: "How we use your information" },
  { id: "information-sharing", title: "Information we share" },
  { id: "data-security", title: "Data security & clinical integrity" },
  { id: "patient-rights", title: "Your privacy choices & rights" },
  { id: "third-party", title: "Third-party sites and external links" },
  { id: "contact-details", title: "Contact details & grievance officer" },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<string>("types-of-info");

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
            <ShieldCheck className="h-3.5 w-3.5 text-[#84b3ce]" />
            <span>Healthcare Privacy & Transparency</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#16587b]">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last updated: November 2026 • MediConnect Health Systems
          </p>
        </div>

        {/* 2-Column Responsive Layout Matching Reference Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* ==================== LEFT SIDEBAR: TABLE OF CONTENTS (MATCHING REFERENCE) ==================== */}
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

          {/* ==================== RIGHT MAIN CONTENT (TYPOGRAPHIC DOCUMENTATION) ==================== */}
          <main className="lg:col-span-8 space-y-12">
            
            {/* Section 1 */}
            <section id="types-of-info" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Types of information we collect online
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The types of Personal Data that we may collect while you use the MediConnect platform are described in this section and include information that you provide to us directly and information collected automatically when navigating our healthcare services.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3">
                For purposes of this Privacy Notice, <strong>&ldquo;Personal Data&rdquo;</strong> means information that identifies you or could reasonably be used to identify you as an individual patient, healthcare practitioner, or administrator.
              </p>

              <h3 className="text-lg font-bold text-[#16587b] mt-6 mb-2">
                Information You Provide
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                You generally do not have to register to search verified doctors, browse medical services, or view clinic locations. However, access to specialized features—such as booking an appointment, submitting a doctor application, or accessing admin logs—requires account creation.
              </p>

              <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-2 text-xs sm:text-sm text-slate-700">
                <p className="font-bold text-[#16587b]">This includes:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>Patient Records:</strong> Full name, verified email address, phone number, and scheduled appointment history.</li>
                  <li><strong>Doctor Credentials:</strong> Full legal name, medical qualification degrees, council registration numbers, clinical experience, physical clinic address, and verification documents.</li>
                  <li><strong>Communications:</strong> Messages exchanged when contacting our patient care or clinic support team.</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section id="no-financial-data" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Financial & fee policy (No payment gateway)
              </h2>
              <div className="rounded-3xl bg-[#84b3ce]/10 border border-[#84b3ce]/30 p-6 sm:p-7">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#84b3ce]/20 text-[#84b3ce]">
                    <Lock className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#16587b]">
                      100% Free Booking • Zero Financial Data Collection
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      MediConnect does <strong>not</strong> operate an online payment gateway. We do not ask for, collect, process, or store credit cards, debit cards, UPI credentials, or bank account details.
                    </p>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      All consultation fees displayed on doctor profiles are <strong>informational only</strong>. Patients pay their consultation charges directly at the doctor&apos;s physical clinic during their visit.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="automatic-info" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Information that may be collected automatically
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                When you visit our site, our servers automatically record basic technical data to ensure session security and platform reliability:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600">
                <li>Browser type, device architecture, operating system, and IP address.</li>
                <li>Session authentication cookies (stored securely as HttpOnly tokens to keep you logged in).</li>
                <li>Pages visited, search filter queries, and time stamps.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="how-we-use" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                How we use your information
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We use the information we collect for strictly defined healthcare coordination purposes:
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold text-[#16587b] mb-1">Appointment Management</h4>
                  <p className="text-xs text-slate-500">Delivering appointment booking requests and schedule confirmations directly to your chosen doctor.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold text-[#16587b] mb-1">Doctor Verification</h4>
                  <p className="text-xs text-slate-500">Enabling administrators to review degrees, medical council licenses, and clinical practice standards.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold text-[#16587b] mb-1">Real-Time Status Alerts</h4>
                  <p className="text-xs text-slate-500">Notifying patients when a practitioner accepts, reschedules, or confirms a consultation slot.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold text-[#16587b] mb-1">Compliance & Security</h4>
                  <p className="text-xs text-slate-500">Maintaining immutable audit logs for administrative decisions, preventing unauthorized portal access.</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="information-sharing" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Information we share
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                MediConnect operates with an uncompromised commitment to medical privacy:
              </p>
              <div className="mt-3 p-5 rounded-2xl border border-slate-200 bg-white space-y-3 text-xs sm:text-sm text-slate-700">
                <p><strong>• With Your Selected Doctor:</strong> When you book a slot, we share your name and contact details with the verified practitioner solely to coordinate your visit.</p>
                <p><strong>• No Commercial Sale of Data:</strong> We never sell, rent, or lease patient healthcare data, contact lists, or medical browsing habits to advertisers, data brokers, or pharmaceutical companies.</p>
                <p><strong>• Legal & Public Health Requirements:</strong> We may disclose information only if strictly mandated by applicable health safety laws or a valid court order.</p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="data-security" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Data security & clinical integrity
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We implement industry-grade technical and organizational safeguards:
              </p>
              <ul className="mt-3 list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li>End-to-end TLS/SSL transport encryption for all web requests.</li>
                <li>One-way salted bcrypt hashing for all stored account passwords.</li>
                <li>Secure HttpOnly cookie token storage preventing Cross-Site Scripting (XSS) leaks.</li>
                <li>Role-Based Access Control (RBAC) separating Admin, Doctor, and Patient data partitions.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="patient-rights" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Your privacy choices & rights
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                You maintain complete control over your profile. You may review your past appointments, update your contact details, or request full account deletion at any time by contacting our privacy desk.
              </p>
            </section>

            {/* Section 8 */}
            <section id="third-party" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Third-party sites and external links
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Doctor profiles may contain physical street addresses, clinic website references, or map directions. MediConnect is not responsible for the privacy policies of external clinic websites.
              </p>
            </section>

            {/* Section 9 */}
            <section id="contact-details" className="scroll-mt-28">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#16587b] mb-4">
                Contact details & grievance officer
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                If you have questions regarding our privacy practices or wish to submit a data inquiry, please reach out to our privacy officer:
              </p>

              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-2 text-xs sm:text-sm text-slate-700">
                <p><strong>MediConnect Health Systems Grievance Desk</strong></p>
                <p>Email: <a href="mailto:privacy@mediconnect.com" className="text-[#84b3ce] font-bold hover:underline">privacy@mediconnect.com</a></p>
                <p>Helpline: +91 (800) 247-MEDIC</p>
                <p className="text-slate-500 text-xs mt-1">Operational Hours: Monday – Saturday, 9:00 AM – 6:00 PM IST</p>
              </div>
            </section>

          </main>

        </div>

      </div>
    </div>
  );
}

