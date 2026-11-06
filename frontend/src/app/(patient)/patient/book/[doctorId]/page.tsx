"use client";

import React, { useState, useEffect, use, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { publicApi } from "@/services/publicApi";
import { patientApi } from "@/services/patientApi";
import { useAuthStore } from "@/store/useAuthStore";
import {
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  AlertCircle,
  Building2,
  Lock,
} from "lucide-react";

export interface ScheduleDay {
  _id?: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isAvailable: boolean;
}

export interface BlockedSlotModel {
  _id: string;
  doctor: string;
  date: string;
  reason: string;
}

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

function PatientBookContent({ doctorId }: { doctorId: string }) {
  const router = useRouter();
  const { user } = useAuthStore();

  const [doctor, setDoctor] = useState<DoctorDetailsModel | null>(null);
  const [availabilitySchedule, setAvailabilitySchedule] = useState<ScheduleDay[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlotModel[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // 1. Fetch doctor details & availability schedule on mount
  useEffect(() => {
    let isMounted = true;
    async function loadDoctorData() {
      try {
        setIsLoading(true);
        // Fetch public profile and availability in parallel
        const [profileRes, availabilityRes] = await Promise.all([
          publicApi.getDoctorProfile(doctorId),
          patientApi.checkDoctorAvailability(doctorId).catch(() => null),
        ]);

        if (isMounted && profileRes) {
          const profileData = profileRes.doctorProfile || profileRes.doctor || profileRes;
          setDoctor(profileData);
        }

        if (isMounted && availabilityRes) {
          if (availabilityRes.availabilitySchedule) {
            setAvailabilitySchedule(availabilityRes.availabilitySchedule);
          }
          if (availabilityRes.blockedSlots) {
            setBlockedSlots(availabilityRes.blockedSlots);
          }
        }
      } catch (error) {
        console.error("Failed to fetch doctor booking data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDoctorData();
    return () => {
      isMounted = false;
    };
  }, [doctorId]);

  // Default fallback schedules if backend schedule is empty
  const defaultSchedules: ScheduleDay[] = [
    { dayOfWeek: "Monday", startTime: "10:00", endTime: "17:00", slotDurationMinutes: 30, isAvailable: true },
    { dayOfWeek: "Tuesday", startTime: "11:00", endTime: "18:00", slotDurationMinutes: 30, isAvailable: true },
    { dayOfWeek: "Wednesday", startTime: "11:00", endTime: "17:00", slotDurationMinutes: 30, isAvailable: true },
    { dayOfWeek: "Thursday", startTime: "09:00", endTime: "17:00", slotDurationMinutes: 30, isAvailable: true },
    { dayOfWeek: "Friday", startTime: "09:00", endTime: "17:00", slotDurationMinutes: 30, isAvailable: true },
    { dayOfWeek: "Saturday", startTime: "09:00", endTime: "17:00", slotDurationMinutes: 30, isAvailable: true },
    { dayOfWeek: "Sunday", startTime: "09:00", endTime: "17:00", slotDurationMinutes: 30, isAvailable: false },
  ];

  const activeSchedules = availabilitySchedule.length > 0 ? availabilitySchedule : defaultSchedules;

  // Generate upcoming 10 days for patient date selection
  const upcomingDays = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" }) as ScheduleDay["dayOfWeek"];
      const shortDay = d.toLocaleDateString("en-US", { weekday: "short" });
      const month = d.toLocaleDateString("en-US", { month: "short" });
      const dateNum = d.getDate();
      const isoDateString = d.toISOString().split("T")[0]; // "YYYY-MM-DD"

      // Check if this date matches any blocked slot (ignoring time part)
      const matchedBlock = blockedSlots.find((b) => {
        const bDateString = new Date(b.date).toISOString().split("T")[0];
        return bDateString === isoDateString;
      });

      const daySchedule = activeSchedules.find((s) => s.dayOfWeek === dayName);
      
      // A day is available only if the weekly schedule says so AND it's not blocked
      const isAvailable = Boolean(daySchedule && daySchedule.isAvailable && !matchedBlock);

      days.push({
        fullDate: d,
        isoString: isoDateString,
        dayName,
        shortDay,
        month,
        dateNum,
        isAvailable,
        schedule: daySchedule,
        blockedReason: matchedBlock ? matchedBlock.reason : null,
      });
    }
    return days;
  }, [activeSchedules, blockedSlots]);

  const firstAvailableDay = upcomingDays.find((d) => d.isAvailable) || upcomingDays[0];
  const [selectedDate, setSelectedDate] = useState(firstAvailableDay);

  // Update selectedDate when upcomingDays recalculates
  useEffect(() => {
    if (firstAvailableDay) {
      setSelectedDate(firstAvailableDay);
    }
  }, [firstAvailableDay]);

  // Generate time slots based on the selected day's startTime, endTime, and slotDurationMinutes
  const availableSlots = useMemo(() => {
    if (!selectedDate.schedule || !selectedDate.schedule.isAvailable || selectedDate.blockedReason) {
      return [];
    }

    const { startTime, endTime, slotDurationMinutes } = selectedDate.schedule;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    const duration = slotDurationMinutes && slotDurationMinutes > 0 ? slotDurationMinutes : 30;

    const slots = [];
    for (let time = startTotal; time + duration <= endTotal; time += duration) {
      const h = Math.floor(time / 60);
      const m = time % 60;
      const period = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m < 10 ? `0${m}` : m;
      const slotString = `${displayH}:${displayM} ${period}`;

      slots.push(slotString);
    }
    return slots;
  }, [selectedDate]);

  // 3. Handle Booking Submission to match controller
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeSlot || !doctor) return;

    if (!user || user.role !== "patient") {
      setErrorMessage("Only authenticated patient accounts can book appointments.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      // Matches backend body requirements: { appointmentDate, timeSlot, consultationFee }
      await patientApi.bookAppointment(doctor._id, {
        appointmentDate: selectedDate.fullDate.toISOString(),
        timeSlot: selectedTimeSlot,
        consultationFee: doctor.consultationFee,
      });

      setIsBookedSuccess(true);
    } catch (err: any) {
      console.error("Booking error:", err);
      setErrorMessage(err?.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e2f1f8] via-[#eef6fa] to-slate-50/60 pt-28 sm:pt-36 pb-12">
        <div
          className="pointer-events-none absolute -top-24 right-1/4 h-[520px] w-[520px] rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(132, 179, 206, 0.7) 0%, rgba(255, 255, 255, 0) 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="mb-6">
            <Link
              href={`/doctors/${doctorId}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#16587b] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Doctor Profile</span>
            </Link>
          </div>

          {errorMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 shadow-xs">
              <Lock className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-lg shadow-slate-200/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-[#84b3ce]/15 text-[#16587b] shadow-md">
                  <Stethoscope className="h-10 w-10 text-[#84b3ce]" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#16587b] tracking-tight">
                      Booking for {doctor.user.name}
                    </h1>
                    {doctor.user.status === "active" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#84b3ce]/15 px-3 py-1 text-xs font-bold text-[#16587b] border border-[#84b3ce]/30">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#84b3ce]" />
                        <span>Admin Verified</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-[#84b3ce]">
                    {doctor.specialization.name} •{" "}
                    <span className="text-slate-600 font-medium">
                      {doctor.qualifications.join(", ")}
                    </span>
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 border border-amber-200/50">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-amber-800">{doctor.averageRating}</span>
                      </div>
                      <span>({doctor.totalReviews} verified reviews)</span>
                    </div>

                    <span>•</span>

                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doctor.experienceYears}+ Years Clinical Experience</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 flex flex-col items-start md:items-end justify-center min-w-[200px]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Consultation Fee
                </span>
                <span className="text-2xl font-black text-[#16587b] mt-0.5">
                  ₹{doctor.consultationFee}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pay at Clinic • Zero Prepayment</span>
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ==================== CONTENT & BOOKING SECTION ==================== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: DETAILS & CLINIC INFO */}
            <div className="lg:col-span-7 space-y-8">
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-[#16587b] mb-3">About Doctor</h2>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {doctor.bio}
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-[#84b3ce]" />
                  <h2 className="text-lg font-bold text-[#16587b]">Clinic Location & Address</h2>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-2">
                  <p className="text-sm font-bold text-[#16587b]">
                    {doctor.clinicAddress.street}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {doctor.clinicAddress.city}, {doctor.clinicAddress.state} — {doctor.clinicAddress.pincode}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#84b3ce]">
                    <MapPin className="w-4 h-4" />
                    <span>Physical consultation takes place at this verified clinic.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: BOOKING WIDGET */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-200/50">
                
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#84b3ce]" />
                    <h3 className="text-base font-bold text-[#16587b]">Schedule Appointment</h3>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/50">
                    Live Booking
                  </span>
                </div>

                {isBookedSuccess ? (
                  <div className="py-8 text-center animate-fadeIn space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h4 className="text-xl font-black text-[#16587b]">Appointment Requested!</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                      Your appointment request for <strong>{doctor.user.name}</strong> on{" "}
                      <strong>{selectedDate.shortDay}, {selectedDate.month} {selectedDate.dateNum}</strong> at{" "}
                      <strong>{selectedTimeSlot}</strong> has been successfully booked.
                    </p>
                    
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1.5">
                      <p className="text-slate-400 font-semibold uppercase text-[10px]">Payment Instructions</p>
                      <p className="font-bold text-[#16587b]">Consultation Fee: ₹{doctor.consultationFee}</p>
                      <p className="text-slate-500">Pay directly at clinic counter upon check-in. No online charge applied.</p>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <Link
                        href="/patient/appointments"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#16587b] py-3 text-xs font-bold text-white hover:bg-[#124561] transition cursor-pointer shadow-sm"
                      >
                        <span>View in My Appointments</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsBookedSuccess(false);
                          setSelectedTimeSlot(null);
                        }}
                        className="w-full rounded-2xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Book Another Slot
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="mt-6 space-y-6">
                    
                    {/* Date selection strip */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        1. Select Consultation Date
                      </label>

                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {upcomingDays.map((d) => {
                          const isSelected = selectedDate.isoString === d.isoString;
                          return (
                            <button
                              key={d.isoString}
                              type="button"
                              disabled={!d.isAvailable}
                              onClick={() => {
                                setSelectedDate(d);
                                setSelectedTimeSlot(null);
                              }}
                              className={`flex flex-col items-center justify-center rounded-2xl py-3 px-3.5 min-w-[64px] border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#16587b] text-white border-[#16587b] shadow-md scale-105"
                                  : d.isAvailable
                                  ? "bg-slate-50 text-slate-700 border-slate-200/80 hover:border-[#84b3ce]"
                                  : "bg-slate-100/50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50"
                              }`}
                            >
                              <span className="text-[10px] font-bold uppercase">{d.shortDay}</span>
                              <span className="text-base font-black my-0.5">{d.dateNum}</span>
                              <span className="text-[9px] font-semibold">{d.month}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time slots */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          2. Available Time Slots
                        </label>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {availableSlots.length} slots available
                        </span>
                      </div>

                      {selectedDate.blockedReason ? (
                        <div className="rounded-2xl bg-amber-50 border border-amber-200/60 p-4 text-center">
                          <AlertCircle className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                          <p className="text-xs font-bold text-amber-900">Doctor Unavailable (Blocked)</p>
                          <p className="text-[11px] text-amber-700 mt-0.5">Reason: {selectedDate.blockedReason}</p>
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                          {availableSlots.map((slotString) => {
                            const isSelected = selectedTimeSlot === slotString;
                            return (
                              <button
                                key={slotString}
                                type="button"
                                onClick={() => setSelectedTimeSlot(slotString)}
                                className={`rounded-xl py-2.5 px-2 text-xs font-bold transition cursor-pointer text-center ${
                                  isSelected
                                    ? "bg-[#16587b] text-white shadow-sm ring-2 ring-[#84b3ce]/40"
                                    : "bg-slate-50 text-slate-700 border border-slate-200/80 hover:border-[#84b3ce] hover:bg-slate-100"
                                }`}
                              >
                                {slotString}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-amber-50 border border-amber-200/60 p-4 text-center">
                          <AlertCircle className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                          <p className="text-xs font-bold text-amber-900">Doctor not taking visits on this day</p>
                          <p className="text-[11px] text-amber-700 mt-0.5">Please select another date from the calendar above.</p>
                        </div>
                      )}
                    </div>

                    {/* Submit action */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">Consultation Fee</span>
                        <span className="font-black text-[#16587b] text-sm">₹{doctor.consultationFee}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">Selected Slot</span>
                        <span className="font-bold text-[#16587b]">
                          {selectedTimeSlot ? `${selectedDate.shortDay}, ${selectedTimeSlot}` : "Please pick a slot"}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={!selectedTimeSlot || isSubmitting}
                        className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#16587b] py-3.5 text-xs font-bold text-white shadow-lg shadow-[#16587b]/20 hover:bg-[#124561] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSubmitting ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#84b3ce]" />
                            <span>Confirm Free Booking (Pay at Clinic)</span>
                          </>
                        )}
                      </button>

                      <p className="text-[10px] text-center text-slate-400 font-medium">
                        No cancellation charges. Status updates will be sent to your patient account.
                      </p>
                    </div>

                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default function PatientBookPage({
  params,
}: {
  params: Promise<{ doctorId: string }>;
}) {
  const unwrappedParams = use(params);
  const doctorId = unwrappedParams.doctorId;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#84b3ce] border-t-transparent" />
        </div>
      }
    >
      <PatientBookContent doctorId={doctorId} />
    </Suspense>
  );
}