"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { publicApi } from "@/services/publicApi";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  Stethoscope,
  Building2,
  Calendar,
  Lock,
} from "lucide-react";

export interface DoctorDetailsModel {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
  specialization: {
    _id: string;
    name: string;
    description: string;
  };
  qualifications: string[];
  experienceYears: number;
  consultationFee: number;
  clinicAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  bio: string;
  averageRating: number;
  totalReviews: number;
  isPublished: boolean;
}

function DoctorDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuthStore();

  const [doctor, setDoctor] = useState<DoctorDetailsModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Fetch live doctor profile from publicApi
  useEffect(() => {
    let isMounted = true;
    async function loadDoctorProfile() {
      try {
        setIsLoading(true);
        const data = await publicApi.getDoctorProfile(id);
        if (isMounted && data) {
          const profileData = data.doctorProfile || data.doctor || data;
          setDoctor(profileData);
        }
      } catch (error) {
        console.error("Failed to fetch doctor profile:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDoctorProfile();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handle Book Appointment Click with auth & role check
  const handleBookNowClick = () => {
    setAuthNotice(null);

    // If not logged in, redirect to login page
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // If logged in but not a patient (e.g. doctor or admin)
    if (user.role !== "patient") {
      setAuthNotice("Only patient accounts can book doctor appointments. Please log in with a patient account.");
      return;
    }

    // Otherwise, redirect to patient booking route
    router.push(`/patient/book/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#84b3ce] border-t-transparent" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <h2 className="text-xl font-bold text-[#16587b] mb-2">Doctor Profile Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The requested doctor profile could not be loaded.</p>
        <Link href="/doctors" className="rounded-full bg-[#16587b] px-6 py-3 text-xs font-bold text-white">
          Back to Doctors Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* ==================== HERO HEADER ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e2f1f8] via-[#eef6fa] to-slate-50/60 pt-28 sm:pt-36 pb-12">
        <div
          className="pointer-events-none absolute -top-24 right-1/4 h-[520px] w-[520px] rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(132, 179, 206, 0.7) 0%, rgba(255, 255, 255, 0) 70%)",
          }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="mb-6">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#16587b] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Doctors Directory</span>
            </Link>
          </div>

          {/* Auth Notice Alert if wrong role */}
          {authNotice && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800 shadow-xs">
              <Lock className="h-4 w-4 text-amber-600 shrink-0" />
              <span>{authNotice}</span>
            </div>
          )}
        </div>
      </section>

      {/* ==================== SINGLE CARD LAYOUT ==================== */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          
          {/* Card Header Banner */}
          <div className="bg-gradient-to-r from-[#16587b] to-[#124662] p-6 sm:p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-start sm:items-center gap-5">
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-3xl bg-white text-[#16587b] shadow-lg">
                  <Stethoscope className="h-10 w-10 sm:h-12 sm:w-12 text-[#16587b]" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {doctor.user.name}
                    </h1>
                    {doctor.user.status === "active" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white border border-white/20">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#84b3ce]" />
                        <span>Admin Verified</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-[#84b3ce]">
                    {doctor.specialization.name}
                  </p>

                  <p className="text-xs text-white/80">
                    {doctor.qualifications.join(", ")}
                  </p>
                </div>
              </div>

              {/* Fee & Booking CTA Action */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 flex flex-col items-start md:items-end justify-center min-w-[220px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#84b3ce]">
                  Consultation Fee
                </span>
                <span className="text-2xl font-black text-white mt-0.5">
                  ₹{doctor.consultationFee}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 mt-0.5 mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pay at Clinic • Zero Online Prepayment</span>
                </span>

                <button
                  type="button"
                  onClick={handleBookNowClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-[#16587b] shadow-lg hover:bg-slate-100 active:scale-95 transition cursor-pointer"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Appointment Now</span>
                </button>
              </div>

            </div>
          </div>

          {/* Card Body Details */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500 border border-amber-100">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Patient Rating</p>
                  <p className="text-base font-extrabold text-slate-900">
                    {doctor.averageRating} <span className="text-xs font-normal text-slate-500">({doctor.totalReviews} reviews)</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16587b]/10 text-[#16587b] border border-[#16587b]/20">
                  <Briefcase className="h-5 w-5 text-[#16587b]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Experience</p>
                  <p className="text-base font-extrabold text-slate-900">{doctor.experienceYears}+ Years Clinical</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Consultation Type</p>
                  <p className="text-base font-extrabold text-slate-900">In-Clinic Visit</p>
                </div>
              </div>
            </div>

            {/* About Doctor */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#16587b]">About Doctor</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {doctor.bio}
              </p>
            </div>

            {/* Qualifications & Degrees */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#84b3ce]" />
                <h3 className="text-base font-bold text-[#16587b]">Qualifications & Degrees</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {doctor.qualifications.map((qual, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2 text-xs font-bold text-[#16587b]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#84b3ce]" />
                    <span>{qual}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Clinic Location & Address */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#84b3ce]" />
                <h3 className="text-base font-bold text-[#16587b]">Clinic Location & Address</h3>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-1.5">
                <p className="text-sm font-bold text-slate-900">
                  {doctor.clinicAddress.street}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {doctor.clinicAddress.city}, {doctor.clinicAddress.state} — {doctor.clinicAddress.pincode}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#16587b]">
                  <MapPin className="w-4 h-4 text-[#84b3ce]" />
                  <span>Physical consultation takes place at this verified clinic address.</span>
                </div>
              </div>
            </div>

            {/* Bottom Sticky CTA Bar Inside Card */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/60 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 lg:-mx-10 lg:-mb-10 p-6 sm:p-8">
              <div>
                <p className="text-sm font-bold text-slate-900">Ready for your consultation?</p>
                <p className="text-xs text-slate-500">Pick your preferred date and time slot instantly online.</p>
              </div>

              <button
                type="button"
                onClick={handleBookNowClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#16587b] px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-[#16587b]/20 hover:bg-[#124561] active:scale-95 transition cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-[#84b3ce]" />
                <span>Book Appointment Now</span>
              </button>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}

function DoctorDetailWrapper({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  return <DoctorDetailContent id={unwrappedParams.id} />;
}

export default function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#84b3ce] border-t-transparent" />
        </div>
      }
    >
      <DoctorDetailWrapper params={params} />
    </Suspense>
  );
}