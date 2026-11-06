"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Stethoscope,
  Briefcase,
  IndianRupee,
  RotateCcw,
  Sparkles,
  X,
  ChevronDown,
  ArrowDown,
} from "lucide-react";
import DoctorCard, { DoctorModel } from "@/components/doctor-card";
import { publicApi } from "@/services/publicApi";

interface ServiceItem {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

const CITIES_LIST = [
  "All Locations",
  "Mumbai",
  "Delhi NCR",
  "New Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
];

const EXPERIENCE_OPTIONS = [
  { label: "Any Experience", value: 0 },
  { label: "5+ Years", value: 5 },
  { label: "10+ Years", value: 10 },
  { label: "15+ Years", value: 15 },
];

const FEE_RANGES = [
  { label: "All Fees", max: 5000 },
  { label: "Under ₹600", max: 600 },
  { label: "Under ₹900", max: 900 },
  { label: "Under ₹1,200", max: 1200 },
];

function DoctorsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search Param Pre-fills
  const initialSpecialty = searchParams.get("specialty") || "";
  const initialLocation = searchParams.get("location") || "";

  // Dynamic States
  const [doctors, setDoctors] = useState<DoctorModel[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specializations");
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const [minExperience, setMinExperience] = useState(0);
  const [maxFee, setMaxFee] = useState(5000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadDoctors() {
      try {
        setIsLoadingDoctors(true);
        const data = await publicApi.getDoctors();
        if (isMounted && data) {
          const list = data.doctors || data.data || (Array.isArray(data) ? data : []);
          setDoctors(list);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        if (isMounted) setIsLoadingDoctors(false);
      }
    }

    loadDoctors();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadServices() {
      try {
        setIsLoadingServices(true);
        const data = await publicApi.getServices();
        if (isMounted && data) {
          const list = data.services || data.data || (Array.isArray(data) ? data : []);
          setServices(list.filter((s: ServiceItem) => s.isActive !== false));
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        if (isMounted) setIsLoadingServices(false);
      }
    }

    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync initial URL query parameters
  useEffect(() => {
    if (initialSpecialty) {
      setSelectedSpecialty(initialSpecialty);
    }

    if (initialLocation && initialLocation !== "All Locations") {
      setSelectedCity(initialLocation);
    }
  }, [initialSpecialty, initialLocation]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("All Specializations");
    setSelectedCity("All Locations");
    setMinExperience(0);
    setMaxFee(5000);
    router.push("/doctors");
  };

  // Helper map for converting specialization ID references to names
  const serviceMap = useMemo(() => {
    const map = new Map<string, string>();
    services.forEach((s) => {
      map.set(s._id, s.name);
    });
    return map;
  }, [services]);

  // Filter logic on fetched doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      let specName = "";
      if (typeof doc.specialization === "object" && doc.specialization !== null) {
        specName = (doc.specialization as { name?: string }).name || "";
      } else if (typeof doc.specialization === "string") {
        specName = serviceMap.get(doc.specialization) || doc.specialization;
      }

      // Search Query (Name, Specialization, City, Street, Qualifications, Bio)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = doc.user?.name?.toLowerCase().includes(query);
        const specMatch = specName.toLowerCase().includes(query);
        const cityMatch = doc.clinicAddress?.city?.toLowerCase().includes(query);
        const streetMatch = doc.clinicAddress?.street?.toLowerCase().includes(query);
        const bioMatch = doc.bio?.toLowerCase().includes(query);
        const qualMatch = doc.qualifications?.some((q) =>
          q.toLowerCase().includes(query)
        );

        if (!nameMatch && !specMatch && !cityMatch && !streetMatch && !qualMatch && !bioMatch) {
          return false;
        }
      }

      // Specialty Filter
      if (
        selectedSpecialty !== "All Specializations" &&
        selectedSpecialty !== "" &&
        !specName.toLowerCase().includes(selectedSpecialty.toLowerCase())
      ) {
        return false;
      }

      // Location / City Filter
      if (
        selectedCity !== "All Locations" &&
        selectedCity !== "" &&
        doc.clinicAddress?.city?.toLowerCase() !== selectedCity.toLowerCase()
      ) {
        return false;
      }

      // Experience Filter
      if (doc.experienceYears < minExperience) {
        return false;
      }

      // Consultation Fee Filter
      if (doc.consultationFee > maxFee) {
        return false;
      }

      return true;
    });
  }, [doctors, searchQuery, selectedSpecialty, selectedCity, minExperience, maxFee, serviceMap]);

  const activeFilterCount =
    (selectedSpecialty !== "All Specializations" && selectedSpecialty !== "" ? 1 : 0) +
    (selectedCity !== "All Locations" && selectedCity !== "" ? 1 : 0) +
    (minExperience > 0 ? 1 : 0) +
    (maxFee < 5000 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e2f1f8] via-[#eef6fa] to-slate-50/50 -mt-20 sm:-mt-24 min-h-screen flex flex-col justify-center pt-28 sm:pt-36 pb-16">
        <div
          className="pointer-events-none absolute -top-24 right-1/4 h-[520px] w-[520px] rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(132, 179, 206, 0.7) 0%, rgba(255, 255, 255, 0) 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 border border-white/80 shadow-xs text-xs font-semibold text-[#16587b] mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#84b3ce]" />
              <span>Verified Doctor Directory</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#16587b] leading-[1.1]">
              Find Top{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16587b] to-[#84b3ce]">
                Doctors & Specialists
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Browse through administrator-verified medical practitioners. Compare degrees, clinical experience, clinic locations, and transparent consultation fees with zero advance payment
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#directory"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#16587b] px-7 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-[#124561] active:scale-95 transition-all shadow-lg shadow-[#16587b]/25 cursor-pointer"
              >
                <span>Browse Doctor Directory</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </a>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-white/90 border border-slate-200 px-6 py-3.5 text-xs sm:text-sm font-bold text-[#16587b] hover:border-[#84b3ce] hover:bg-white transition-all shadow-xs"
              >
                <span>Explore Departments</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN DIRECTORY SECTION */}
      <div id="directory" className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search bar */}
          <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, degree (e.g. MBBS, MD), or clinic street..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-xs sm:text-sm font-semibold text-[#16587b] placeholder-slate-400 outline-none focus:border-[#84b3ce] shadow-2xs transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#16587b]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <p className="text-xs font-semibold text-slate-500">
                Showing <strong className="text-[#16587b]">{filteredDoctors.length}</strong> doctors
              </p>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 rounded-2xl bg-[#16587b] px-4 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#84b3ce] text-[10px] font-black text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Grid Layout: Sidebar + Doctor Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-24 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#84b3ce]" />
                  <h3 className="text-sm font-bold text-[#16587b]">Refine Search</h3>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Specialization Filter */}
              <div className="mt-5 pb-5 border-b border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  <Stethoscope className="h-3.5 w-3.5 text-[#84b3ce]" />
                  <span>Specialization</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-3 pr-8 text-xs font-semibold text-[#16587b] outline-none focus:border-[#84b3ce] cursor-pointer"
                  >
                    <option value="All Specializations">All Specializations</option>
                    {services.map((item) => (
                      <option key={item._id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              {/* Location Filter */}
              <div className="mt-5 pb-5 border-b border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  <MapPin className="h-3.5 w-3.5 text-[#84b3ce]" />
                  <span>Location</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-3 pr-8 text-xs font-semibold text-[#16587b] outline-none focus:border-[#84b3ce] cursor-pointer"
                  >
                    {CITIES_LIST.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              {/* Experience Filter */}
              <div className="mt-5 pb-5 border-b border-slate-100">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  <Briefcase className="h-3.5 w-3.5 text-[#84b3ce]" />
                  <span>Experience</span>
                </label>
                <div className="space-y-2">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2.5 text-xs font-medium text-slate-600 hover:text-[#16587b] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="experience"
                        checked={minExperience === opt.value}
                        onChange={() => setMinExperience(opt.value)}
                        className="text-[#16587b] focus:ring-[#84b3ce] cursor-pointer"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Consultation Fee Filter */}
              <div className="mt-5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  <IndianRupee className="h-3.5 w-3.5 text-[#84b3ce]" />
                  <span>Max Fee (Pay at Clinic)</span>
                </label>
                <div className="space-y-2">
                  {FEE_RANGES.map((fee) => (
                    <label
                      key={fee.max}
                      className="flex items-center gap-2.5 text-xs font-medium text-slate-600 hover:text-[#16587b] cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="feeRange"
                        checked={maxFee === fee.max}
                        onChange={() => setMaxFee(fee.max)}
                        className="text-[#16587b] focus:ring-[#84b3ce] cursor-pointer"
                      />
                      <span>{fee.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </aside>

            {/* Doctors Grid */}
            <main className="lg:col-span-9">
              {isLoadingDoctors ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-96 rounded-3xl bg-white border border-slate-100 p-6 flex flex-col justify-between shadow-xs"
                    >
                      <div className="space-y-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-100" />
                        <div className="h-5 w-3/4 rounded-lg bg-slate-100" />
                        <div className="h-3 w-1/2 rounded-lg bg-slate-100" />
                        <div className="h-4 w-full rounded-lg bg-slate-100" />
                        <div className="h-4 w-2/3 rounded-lg bg-slate-100" />
                      </div>
                      <div className="h-10 w-full rounded-xl bg-slate-100" />
                    </div>
                  ))}
                </div>
              ) : filteredDoctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDoctors.map((doc) => (
                    <DoctorCard key={doc._id} doctor={doc} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl bg-white border border-dashed border-slate-200 p-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#16587b]">
                    No Doctors Found Matching Your Criteria
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    Try clearing one or more filters, widening your fee range, or searching with another keyword.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#16587b] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#124561] transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}
            </main>

          </div>

        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#84b3ce]" />
                  <h3 className="text-sm font-bold text-[#16587b]">Filters</h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Specialization Filter */}
              <div className="mt-5 pb-5 border-b border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Specialization
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-[#16587b]"
                >
                  <option value="All Specializations">All Specializations</option>
                  {services.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mt-5 pb-5 border-b border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Location
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs font-semibold text-[#16587b]"
                >
                  {CITIES_LIST.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div className="mt-5 pb-5 border-b border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Experience
                </label>
                <div className="space-y-2">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <input
                        type="radio"
                        name="mobileExperience"
                        checked={minExperience === opt.value}
                        onChange={() => setMinExperience(opt.value)}
                        className="text-[#16587b]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fee Filter */}
              <div className="mt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Max Fee
                </label>
                <div className="space-y-2">
                  {FEE_RANGES.map((fee) => (
                    <label key={fee.max} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <input
                        type="radio"
                        name="mobileFee"
                        checked={maxFee === fee.max}
                        onChange={() => setMaxFee(fee.max)}
                        className="text-[#16587b]"
                      />
                      <span>{fee.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 rounded-xl bg-[#16587b] py-2.5 text-xs font-bold text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#84b3ce] border-t-transparent" />
        </div>
      }
    >
      <DoctorsContent />
    </Suspense>
  );
}