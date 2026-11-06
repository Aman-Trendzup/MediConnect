"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Search,
  ArrowUpRight,
  ArrowRight,
  SlidersHorizontal,
  Stethoscope,
  CheckCircle2,
  Users,
  ArrowDown,
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
  createdAt?: string;
}

// Helper to map department names to custom icons
function getDepartmentIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("cardio")) return HeartPulse;
  if (n.includes("neuro")) return Brain;
  if (n.includes("pedia")) return Baby;
  if (n.includes("dental")) return Smile;
  if (n.includes("eye") || n.includes("ophthal")) return Eye;
  if (n.includes("derm")) return Flame;
  if (n.includes("surg")) return Scissors;
  if (n.includes("psy")) return Activity;
  return Stethoscope;
}

function ServicesContent() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    async function fetchAllServices() {
      try {
        setIsLoading(true);
        const data = await publicApi.getServices();
        if (isMounted && data) {
          const list = data.services || data.data || (Array.isArray(data) ? data : []);
          setServices(list.filter((s: ServiceItem) => s.isActive !== false));
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchAllServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      if (activeFilter !== "all" && srv.name.toLowerCase() !== activeFilter.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = srv.name.toLowerCase().includes(query);
        const descMatch = srv.description?.toLowerCase().includes(query);
        return nameMatch || descMatch;
      }
      return true;
    });
  }, [services, activeFilter, searchQuery]);

  const topFive = useMemo(() => {
    if (!searchQuery && activeFilter === "all" && services.length >= 5) {
      return services.slice(0, 5);
    }
    return filteredServices.slice(0, 5);
  }, [services, filteredServices, searchQuery, activeFilter]);

  const remainingServices = useMemo(() => {
    if (!searchQuery && activeFilter === "all" && services.length >= 5) {
      const topIds = new Set(topFive.map((s) => s._id));
      return services.filter((s) => !topIds.has(s._id));
    }
    return filteredServices.slice(5);
  }, [services, filteredServices, topFive, searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e2f1f8] via-[#eef6fa] to-slate-50/50 -mt-20 sm:-mt-24 min-h-screen flex flex-col justify-center pt-28 sm:pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          
          <div className="max-w-3xl mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md px-4 py-1.5 border border-white/80 shadow-xs text-xs font-semibold text-[#16587b] mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#84b3ce]" />
              <span>Verified Clinical Departments</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#16587b] leading-[1.1]">
              Clinical Services &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16587b] to-[#84b3ce]">
                Specializations.
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Explore our comprehensive range of specialized medical departments fetched live from database records. Click any specialization below to view certified practitioners and fees.
            </p>
          </div>

          {/* SEARCH & FILTER CONSOLE */}
          <div className="rounded-[32px] bg-white p-4 sm:p-6 shadow-xl shadow-[#84b3ce]/15 border border-white/80 max-w-4xl mb-8">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search departments or medical treatments..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-xs sm:text-sm font-semibold text-[#16587b] placeholder-slate-400 outline-none focus:border-[#84b3ce] focus:bg-white transition"
                />
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-2 text-xs font-bold text-[#16587b] border border-slate-200/60">
                  <Users className="w-3.5 h-3.5 text-[#84b3ce]" />
                  <span>{services.length} Departments Found</span>
                </span>
                {activeFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter("all");
                      setSearchQuery("");
                    }}
                    className="text-xs font-bold text-[#84b3ce] hover:underline cursor-pointer ml-1"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Quick Category Chips */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`shrink-0 inline-flex items-center gap-2 rounded-2xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-[#16587b] text-white shadow-md shadow-[#16587b]/20"
                    : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:border-[#84b3ce] hover:text-[#16587b]"
                }`}
              >
                <SlidersHorizontal className="w-3 h-3 text-[#84b3ce]" />
                <span>All</span>
                <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${activeFilter === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                  {services.length}
                </span>
              </button>

              {services.map((srv) => {
                const Icon = getDepartmentIcon(srv.name);
                const isSelected = activeFilter.toLowerCase() === srv.name.toLowerCase();

                return (
                  <button
                    key={srv._id}
                    type="button"
                    onClick={() => setActiveFilter(isSelected ? "all" : srv.name)}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#16587b] text-white shadow-md shadow-[#16587b]/20"
                        : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:border-[#84b3ce] hover:text-[#16587b]"
                    }`}
                  >
                    <Icon className={`w-3 h-3 ${isSelected ? "text-[#84b3ce]" : "text-slate-400"}`} />
                    <span>{srv.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 border border-white shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#84b3ce]" />
                <span>Transparent Fees • Pay At Clinic</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 border border-white shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#84b3ce]" />
                <span>Verified Practitioners</span>
              </div>
            </div>

            <a href="#services-mosaic" className="inline-flex items-center gap-1.5 font-bold text-[#16587b] hover:text-[#84b3ce] transition cursor-pointer">
              <span>Explore Departments Mosaic</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </a>
          </div>

        </div>
      </section>

      {/* BENTO GRID SECTION */}
      <div id="services-mosaic" className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#16587b] tracking-tight">
                All Medical Departments ({filteredServices.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any service card below to browse specialized doctors and clinic locations
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 animate-pulse">
              <div className="lg:col-span-4 flex flex-col gap-5 lg:gap-6">
                <div className="h-[280px] rounded-[32px] bg-slate-200" />
                <div className="h-[280px] rounded-[32px] bg-slate-200" />
              </div>
              <div className="lg:col-span-4">
                <div className="h-[580px] rounded-[32px] bg-slate-200" />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-5 lg:gap-6">
                <div className="h-[280px] rounded-[32px] bg-slate-200" />
                <div className="h-[280px] rounded-[32px] bg-slate-200" />
              </div>
            </div>
          )}

          {!isLoading && filteredServices.length === 0 && (
            <div className="rounded-[32px] bg-white border border-dashed border-slate-300 p-12 text-center my-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#16587b]">No Medical Departments Found</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                There are no verified clinical departments matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#16587b] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#124561] transition cursor-pointer"
              >
                <span>View All Departments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!isLoading && filteredServices.length > 0 && (
            <>
              {searchQuery || activeFilter !== "all" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                  {filteredServices.map((srv) => (
                    <ServiceBentoCard
                      key={srv._id}
                      service={srv}
                      variant="stacked"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
                    <div className="lg:col-span-4 flex flex-col gap-5 lg:gap-6">
                      {topFive[0] && <ServiceBentoCard service={topFive[0]} variant="stacked" />}
                      {topFive[1] && <ServiceBentoCard service={topFive[1]} variant="stacked" />}
                    </div>

                    <div className="md:col-span-2 lg:col-span-4 flex flex-col">
                      {topFive[2] && <ServiceBentoCard service={topFive[2]} variant="center-hero" />}
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-5 lg:gap-6">
                      {topFive[3] && <ServiceBentoCard service={topFive[3]} variant="stacked" />}
                      {topFive[4] && <ServiceBentoCard service={topFive[4]} variant="stacked" />}
                    </div>
                  </div>

                  {remainingServices.length > 0 && (
                    <div className="mt-5 lg:mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                        {remainingServices.map((srv) => (
                          <ServiceBentoCard key={srv._id} service={srv} variant="stacked" />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* BOTTOM BANNER */}
          <div className="mt-16 rounded-[36px] bg-gradient-to-br from-[#16587b] via-[#144f6f] to-[#0f3b52] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl shadow-[#16587b]/15">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#84b3ce]/20 blur-3xl" />
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs mb-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#84b3ce]" />
                <span>Direct Doctor Appointments</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                Looking for a Doctor with Specific Credentials or Clinic Near You?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed font-normal">
                Compare certified specialists across all clinical disciplines. Filter by consultation fee, medical degrees, years of clinical experience, and city location with zero advance payment.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-[#16587b] hover:bg-slate-100 transition-all shadow-md group cursor-pointer"
                >
                  <span>Browse All Verified Doctors</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

interface ServiceBentoCardProps {
  service: ServiceItem;
  variant: "stacked" | "center-hero";
}

function ServiceBentoCard({ service, variant }: ServiceBentoCardProps) {
  const Icon = getDepartmentIcon(service.name);
  const targetHref = `/doctors?specialty=${encodeURIComponent(service.name)}`;

  if (variant === "center-hero") {
    return (
      <Link
        href={targetHref}
        className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer border border-slate-200/70 bg-[#f8fafc] h-full min-h-[540px] lg:min-h-[620px]"
      >
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 z-10">
          <span className="flex items-center gap-1.5">
            <span className="text-[#16587b] font-black">Clinical Department</span>
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#16587b] shadow-2xs group-hover:bg-[#16587b] group-hover:text-white transition-all duration-300">
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        <div className="relative my-4 flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/60 p-8">
          <Icon className="w-24 h-24 text-[#16587b]/30 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="relative z-10 pt-2">
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-[#16587b] shadow-2xs border border-slate-200/60">
              <Icon className="w-3.5 h-3.5 text-[#84b3ce]" />
              <span>{service.name}</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#16587b] tracking-tight leading-tight group-hover:text-[#84b3ce] transition-colors">
            {service.name}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 line-clamp-3 font-normal leading-relaxed">
            {service.description}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#16587b] group-hover:text-[#84b3ce] transition-colors">
            <span>Find {service.name} Specialists</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={targetHref}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] sm:rounded-[36px] p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer border border-slate-200/70 bg-[#f8fafc] flex-1 min-h-[290px]"
    >
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider z-10 text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="font-black text-[#16587b]">Active Specialty</span>
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#16587b] shadow-2xs group-hover:bg-[#16587b] group-hover:text-white transition-all duration-300">
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 items-center my-3">
        <div className="col-span-8">
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-2xs bg-white text-[#16587b] border border-slate-200/60">
              <Icon className="w-3.5 h-3.5 text-[#84b3ce]" />
              <span>{service.name}</span>
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug line-clamp-2 text-[#16587b] group-hover:text-[#84b3ce] transition-colors">
            {service.name}
          </h3>
        </div>
        <div className="col-span-4 flex justify-end">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden p-3 flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:scale-105 bg-white/90 border border-slate-200/50">
            <Icon className="w-10 h-10 text-[#16587b]" />
          </div>
        </div>
      </div>

      <div className="pt-1">
        <p className="text-xs line-clamp-2 leading-relaxed text-slate-500">
          {service.description}
        </p>
        <div className="mt-3 flex items-center gap-1 text-xs font-bold transition-colors text-[#16587b] group-hover:text-[#84b3ce]">
          <span>View Doctors</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#84b3ce] border-t-transparent" /></div>}>
      <ServicesContent />
    </Suspense>
  );
}