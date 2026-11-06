"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  MapPin,
  ArrowUpRight,
  Briefcase,
  Stethoscope,
  GraduationCap,
} from "lucide-react";

export interface ClinicAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface DoctorModel {
  _id: string;
  user: {
    _id?: string;
    name: string;
    email?: string;
    phone?: string;
  };
  specialization:
  | {
    _id?: string;
    name: string;
    description?: string;
  }
  | string;
  qualifications: string[];
  experienceYears: number;
  consultationFee: number;
  clinicAddress: ClinicAddress;
  status?: "pending" | "approved" | "rejected" | "needs_correction";
  averageRating?: number;
  totalReviews?: number;
  bio?: string;
  isPublished?: boolean;
}

interface DoctorCardProps {
  doctor: DoctorModel;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  // Extract specialization name whether populated object or string
  const specializationName =
    typeof doctor.specialization === "object" && doctor.specialization !== null
      ? doctor.specialization.name
      : doctor.specialization || "General Medicine";

  // Format qualifications array (from doctorApplication.qualifications)
  const qualificationsText =
    doctor.qualifications && doctor.qualifications.length > 0
      ? doctor.qualifications.join(", ")
      : "Certified Specialist";

  const rating = doctor.averageRating ?? 4.9;
  const reviews = doctor.totalReviews ?? 120;
  const isApproved = doctor.status === "approved" || doctor.isPublished !== false;

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-100 p-6 shadow-lg shadow-[#84b3ce]/10 hover:shadow-2xl hover:shadow-[#84b3ce]/20 hover:-translate-y-2 transition-all duration-300">
      <div>
        {/* Top Row: Specialty Icon Avatar Badge & Verified Status */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#84b3ce]/15 text-[#84b3ce] transition-transform duration-300 group-hover:scale-105">
            <Stethoscope className="h-6 w-6" />
          </div>

          {/* Verified Badge (Approved in Doctor Application) */}
          {isApproved && (
            <div className="flex items-center gap-1.5 rounded-full bg-[#84b3ce]/15 px-3 py-1 border border-[#84b3ce]/30">
              <ShieldCheck className="h-3.5 w-3.5 text-[#84b3ce]" />
              <span className="text-[11px] font-bold text-[#16587b]">
                Verified
              </span>
            </div>
          )}
        </div>

        {/* Rating & Review Count */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 border border-amber-200/50">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-amber-800">{rating}</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            ({reviews} reviews)
          </span>
        </div>

        {/* Doctor Name & Specialization */}
        <h3 className="text-lg font-bold text-[#16587b] tracking-tight group-hover:text-[#84b3ce] transition-colors truncate">
          {doctor.user?.name || "Doctor"}
        </h3>
        <p className="text-xs font-semibold text-[#84b3ce] mt-0.5">
          {specializationName}
        </p>

        {/* Qualifications from Doctor Application Model */}
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{qualificationsText}</span>
        </div>

        {/* Experience & Clinic Address from Doctor Application Model */}
        <div className="mt-4 space-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{doctor.experienceYears}+ Years Clinical Experience</span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className=" font-medium text-slate-700">
                {doctor.clinicAddress?.street || "Clinic Center"}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {doctor.clinicAddress?.city}, {doctor.clinicAddress?.state} - {doctor.clinicAddress?.pincode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Fee & Booking CTA */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-3">
        {/* Fee Display Banner (Transparent Notice) */}
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Consultation Fee
          </span>
          <div className="text-right">
            <span className="text-base font-black text-[#16587b]">
              ₹{doctor.consultationFee}
            </span>
            <span className="block text-[9px] font-semibold text-emerald-600">
              Pay At Clinic
            </span>
          </div>
        </div>

        {/* Booking Button */}
        <Link
          href={`/doctors/${doctor._id}`}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#16587b] py-3 text-xs font-bold text-white shadow-md shadow-[#16587b]/20 hover:bg-[#124561] active:scale-[0.98] transition-all group/btn cursor-pointer"
        >
          <span>Book Appointment</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}

