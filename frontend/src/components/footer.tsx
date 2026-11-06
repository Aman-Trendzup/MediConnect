"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Mail,
  Phone,
  Stethoscope,
  Activity,
  HeartPulse as HeartPulseIcon,
  Brain,
  Baby,
  Smile,
  Eye,
  Flame,
  Scissors,
} from "lucide-react";
import { publicApi } from "@/services/publicApi";

interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

// Helper to map department names to custom icons
function getDepartmentIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("cardio")) return HeartPulseIcon;
  if (n.includes("neuro")) return Brain;
  if (n.includes("pedia")) return Baby;
  if (n.includes("dental") || n.includes("oral")) return Smile;
  if (n.includes("eye") || n.includes("ophthal")) return Eye;
  if (n.includes("derm") || n.includes("skin")) return Flame;
  if (n.includes("surg")) return Scissors;
  if (n.includes("psy")) return Activity;
  return Stethoscope;
}

export default function Footer() {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadFooterServices() {
      try {
        const data = await publicApi.getServices();
        if (isMounted && data) {
          const list = data.services || data.data || (Array.isArray(data) ? data : []);
          setServices(list.filter((s: ServiceItem) => s.isActive !== false).slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to fetch footer services:", error);
      }
    }
    loadFooterServices();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="bg-[#16587b] text-white pt-16 pb-12 border-t border-white/15 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(132, 179, 206, 1) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />

      {/* Standard Container Layout across all sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ==================== 4-COLUMN FOOTER GRID ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand & Mission (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#16587b] shadow-md group-hover:scale-105 transition-transform">
                  <HeartPulse className="h-5 w-5 text-[#84b3ce]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-white leading-none">
                    Medi<span className="text-[#84b3ce]">Connect</span>
                  </span>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-slate-300 mt-0.5">
                    Healthcare Platform
                  </span>
                </div>
              </Link>

              <p className="mt-4 text-sm text-slate-200 font-normal leading-relaxed max-w-sm">
                A simple and user-friendly healthcare platform connecting patients with verified specialists. Direct schedule bookings with transparent consultation fees.
              </p>
            </div>
          </div>

          {/*  Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-slate-200 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-slate-200 hover:text-white transition">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-200 hover:text-white transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-200 hover:text-white transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/*  Medical Services (Fetched Dynamically from publicApi) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {services.map((srv) => {
                const Icon = getDepartmentIcon(srv.name);
                return (
                  <li key={srv._id}>
                    <Link
                      href={`/doctors?specialty=${encodeURIComponent(srv.name)}`}
                      className="text-slate-200 hover:text-[#84b3ce] transition flex items-center gap-2 group"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#84b3ce] group-hover:scale-110 transition-transform shrink-0" />
                      <span className="truncate">{srv.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact & Support (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Contact & Support
            </h3>
            <div className="space-y-3 text-sm text-slate-200">
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#84b3ce] shrink-0" />
                <span className="text-xs">support@mediconnect.com</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#84b3ce] shrink-0" />
                <span className="text-xs">+91 (800) 247-MEDIC</span>
              </p>
            </div>
          </div>

        </div>

        {/* ==================== BOTTOM BAR: COPYRIGHT & DISCLAIMER ==================== */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <p>©MediConnect Health Systems. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <span className="text-slate-200 font-semibold">
              Notice: Consultation fees are payable directly at the clinic.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}