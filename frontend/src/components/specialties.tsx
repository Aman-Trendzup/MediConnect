"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  Stethoscope,
  Activity,
  HeartPulse,
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
  imageUrl?: string;
  doctorsCount?: string;
}

// Helper to map department names to custom icons
function getDepartmentIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("cardio")) return HeartPulse;
  if (n.includes("neuro")) return Brain;
  if (n.includes("pedia")) return Baby;
  if (n.includes("dental") || n.includes("oral")) return Smile;
  if (n.includes("eye") || n.includes("ophthal")) return Eye;
  if (n.includes("derm") || n.includes("skin")) return Flame;
  if (n.includes("surg")) return Scissors;
  if (n.includes("psy")) return Activity;
  return Stethoscope;
}

export default function SpecialtiesSection() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch services dynamically using publicApi
  useEffect(() => {
    let isMounted = true;
    async function loadServices() {
      try {
        setIsLoading(true);
        const data = await publicApi.getServices();
        if (isMounted && data) {
          const list = data.services || data.data || (Array.isArray(data) ? data : []);
          setServices(list.filter((s: ServiceItem) => s.isActive !== false));
        }
      } catch (err) {
        console.error("Failed to fetch specialties:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="services" className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Background Soft Glow Accents */}
      <div
        className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(132, 179, 206, 0.6) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />

      {/* Standard Container Layout across all sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#84b3ce]/15 px-3.5 py-1 text-xs font-semibold text-[#16587b] mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#84b3ce]" />
              <span>Top Medical Departments</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#16587b] leading-tight">
              Specialized Care For{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16587b] to-[#84b3ce]">
                Every Stage Of Life.
              </span>
            </h2>
            <p className="mt-4 text-base text-slate-500 leading-relaxed font-normal">
              Connect with verified medical experts across specialized disciplines. Compare doctors by experience, view consultation fees, and reserve your visit online.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#16587b] hover:text-[#84b3ce] transition-colors self-start md:self-end group cursor-pointer"
          >
            <span>Explore All Services</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* ==================== 4 SPECIALTIES RESPONSIVE GRID (FETCHED DYNAMICALLY) ==================== */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-100 border border-slate-200/60 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-16 w-16 rounded-2xl bg-slate-200" />
                  <div className="h-5 w-3/4 rounded-lg bg-slate-200" />
                  <div className="h-3 w-full rounded-lg bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-500">No medical departments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((item, idx) => {
              const Icon = getDepartmentIcon(item.name);
              const isFeatured = item.name.toLowerCase().includes("cardio");

              return (
                <Link
                  key={item._id || idx}
                  href={`/doctors?specialty=${encodeURIComponent(item.name)}`}
                  className={`group relative flex flex-col justify-between rounded-3xl p-5 transition-all duration-300 hover:-translate-y-2 cursor-pointer ${
                    isFeatured
                      ? "bg-gradient-to-br from-[#16587b] to-[#84b3ce] text-white shadow-xl shadow-[#84b3ce]/30 border border-[#84b3ce]"
                      : "bg-white text-[#16587b] border border-slate-100 shadow-lg shadow-[#84b3ce]/10 hover:shadow-2xl hover:shadow-[#84b3ce]/20 hover:border-[#84b3ce]/40"
                  }`}
                >
                  {/* Top Row: Icon/Graphic (Left) + Circular Action Button (Right) */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`relative h-20 w-20 rounded-2xl p-3 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
                        isFeatured
                          ? "bg-white/15 backdrop-blur-md"
                          : "bg-gradient-to-br from-[#f2f8fc] to-[#e7f3f9]"
                      }`}
                    >
                      <Icon className={`w-10 h-10 ${isFeatured ? "text-white" : "text-[#16587b]"}`} />
                    </div>

                    {/* Top-Right Circular Arrow Button */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 ${
                        isFeatured
                          ? "bg-white text-[#16587b] shadow-md group-hover:bg-[#16587b] group-hover:text-white"
                          : "bg-[#84b3ce]/20 text-[#16587b] group-hover:bg-[#16587b] group-hover:text-white"
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4 stroke-[2.5] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  {/* Bottom Row: Specialty Content & Doctor Count Badge */}
                  <div className="mt-8 pt-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-lg font-bold tracking-tight transition-colors ${
                          isFeatured ? "text-white" : "text-[#16587b] group-hover:text-[#84b3ce]"
                        }`}
                      >
                        {item.name}
                      </h3>

                      {/* Doctors Count Pill Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isFeatured
                            ? "bg-white/20 text-white backdrop-blur-xs"
                            : "bg-[#84b3ce]/15 text-[#16587b]"
                        }`}
                      >
                        {item.doctorsCount || "15+ Doctors"}
                      </span>
                    </div>

                    <p
                      className={`mt-1 text-xs font-normal line-clamp-2 ${
                        isFeatured ? "text-white/80" : "text-slate-400"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Subtle Bottom Accent Glow on Hover */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#84b3ce]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl" />
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}