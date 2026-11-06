"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Stethoscope,
  ChevronDown,
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
}

const CITIES = [
  "All Locations",
  "Mumbai",
  "Delhi NCR",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
];

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

export default function QuickSearch() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
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
        console.error("Failed to fetch services in QuickSearch:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (specialty) params.set("specialty", specialty);
    if (location && location !== "All Locations") params.set("location", location);

    router.push(`/doctors?${params.toString()}`);
  };

  const handleChipClick = (value: string) => {
    setSpecialty((prev) => (prev === value ? "" : value));
  };

  const popularChips = services;

  return (
    <section className="relative z-30 -mt-10 sm:-mt-14 lg:-mt-16 mb-12">
      {/* Standard Container Layout across all sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Floating Glassmorphic Search Container */}
        <div className="relative rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 p-3 sm:p-4 md:p-5 shadow-2xl shadow-[#84b3ce]/20 transition-all duration-300 hover:shadow-[#84b3ce]/30">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
          >
            {/* Field 1: Specialization Dropdown populated from publicApi services */}
            <div className="md:col-span-7 relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-slate-50/80 hover:bg-slate-50 transition-colors border border-slate-100">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#84b3ce]/15 text-[#16587b]">
                <Stethoscope className="h-5 w-5 text-[#84b3ce]" />
              </div>
              <div className="flex-1 min-w-0">
                <label
                  htmlFor="specialty"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
                >
                  Specialization {isLoading ? "(loading...)" : ""}
                </label>
                <div className="relative">
                  <select
                    id="specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full appearance-none bg-transparent text-sm font-semibold text-[#16587b] focus:outline-none cursor-pointer pr-6 truncate"
                  >
                    <option value="">All Specializations</option>
                    {services.map((item) => (
                      <option key={item._id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Field 2: Location / City */}
            <div className="md:col-span-4 relative flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-slate-50/80 hover:bg-slate-50 transition-colors border border-slate-100">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#84b3ce]/15 text-[#16587b]">
                <MapPin className="h-5 w-5 text-[#84b3ce]" />
              </div>
              <div className="flex-1 min-w-0">
                <label
                  htmlFor="location"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-400"
                >
                  Location / City
                </label>
                <div className="relative">
                  <select
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full appearance-none bg-transparent text-sm font-semibold text-[#16587b] focus:outline-none cursor-pointer pr-5 truncate"
                  >
                    <option value="">Select City (All)</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Submit Action: Primary Brand Button */}
            <div className="md:col-span-1 flex items-center justify-center">
              <button
                type="submit"
                aria-label="Search Doctors"
                className="group relative flex h-14 w-full md:w-14 items-center justify-center rounded-2xl bg-[#16587b] text-white shadow-lg shadow-[#16587b]/25 hover:bg-[#124561] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Search className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="md:hidden ml-2 text-sm font-semibold">Search</span>
              </button>
            </div>
          </form>

          {/* Quick Filter Pill Chips: Dynamically rendered from fetched Services */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 px-1">
            {popularChips.map((item) => {
              const Icon = getDepartmentIcon(item.name);
              const isSelected = specialty.toLowerCase() === item.name.toLowerCase();

              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => handleChipClick(item.name)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#16587b] text-white shadow-md shadow-[#16587b]/20 scale-105"
                      : "bg-white text-slate-600 border border-slate-200/80 hover:border-[#84b3ce] hover:text-[#16587b] hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isSelected ? "text-[#84b3ce]" : "text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}