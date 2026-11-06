"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  MapPin,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { patientApi } from "@/services/patientApi";
import { useAuthStore } from "@/store/useAuthStore";

export interface ScheduleDay {
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isAvailable: boolean;
}

export interface BookingDoctorData {
  _id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  specialization: {
    name: string;
  };
  qualifications?: string[];
  experienceYears?: number;
  clinicAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  consultationFee: number;
  averageRating?: number;
  totalReviews?: number;
  schedules?: ScheduleDay[];
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: BookingDoctorData;
}

export default function BookingModal({
  isOpen,
  onClose,
  doctor,
}: BookingModalProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  // Generate upcoming 10 days for selection
  const upcomingDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" }) as ScheduleDay["dayOfWeek"];
      const shortDay = d.toLocaleDateString("en-US", { weekday: "short" });
      const month = d.toLocaleDateString("en-US", { month: "short" });
      const dateNum = d.getDate();

      const daySchedule = doctor.schedules?.find((s) => s.dayOfWeek === dayName) || {
        dayOfWeek: dayName,
        startTime: "09:00",
        endTime: "16:00",
        slotDurationMinutes: 30,
        isAvailable: dayName !== "Sunday",
      };

      days.push({
        fullDate: d,
        isoString: d.toISOString().split("T")[0],
        dayName,
        shortDay,
        month,
        dateNum,
        isAvailable: Boolean(daySchedule.isAvailable),
        schedule: daySchedule,
      });
    }
    return days;
  }, [doctor]);

  // Selected states
  const firstAvailable = upcomingDays.find((d) => d.isAvailable) || upcomingDays[0];
  const [selectedDate, setSelectedDate] = useState(firstAvailable);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successAppointmentId, setSuccessAppointmentId] = useState<string | null>(null);

  // Reset or initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      const initial = upcomingDays.find((d) => d.isAvailable) || upcomingDays[0];
      setSelectedDate(initial);
      setSelectedTimeSlot(null);
      setSuccessAppointmentId(null);
    }
  }, [isOpen, upcomingDays]);

  // Generate formatted slots like "10:00 AM - 10:30 AM"
  const availableSlots = useMemo(() => {
    if (!selectedDate?.schedule || !selectedDate.schedule.isAvailable) return [];

    const { startTime, endTime, slotDurationMinutes } = selectedDate.schedule;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    const duration = slotDurationMinutes || 30;

    const slots: string[] = [];

    const formatTime = (totalMinutes: number) => {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      const period = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m < 10 ? `0${m}` : m;
      return `${displayH < 10 ? `0${displayH}` : displayH}:${displayM} ${period}`;
    };

    for (let time = startTotal; time + duration <= endTotal; time += duration) {
      const slotStart = formatTime(time);
      const slotEnd = formatTime(time + duration);
      slots.push(`${slotStart} - ${slotEnd}`);
    }

    return slots;
  }, [selectedDate]);

  if (!isOpen) return null;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeSlot) return;

    try {
      setSubmitting(true);
      const profile = await patientApi.getProfile();

      const newApt = await patientApi.createAppointment({
        patient: {
          _id: user?._id || "pat-usr-101",
          name: user?.name || profile?.name || "Nishant Sharma",
          email: user?.email || profile?.email || "patient@mediconnect.com",
          phone: profile?.phone || "9876543210",
        },
        doctor: {
          _id: doctor._id,
          user: {
            name: doctor.user.name,
            email: doctor.user.email,
            avatar: doctor.user.avatar,
          },
          specialization: {
            name: doctor.specialization.name,
          },
          qualifications: doctor.qualifications || ["MBBS", "MD"],
          experienceYears: doctor.experienceYears || 10,
          clinicAddress: doctor.clinicAddress,
          averageRating: doctor.averageRating || 4.9,
          totalReviews: doctor.totalReviews || 120,
        },
        appointmentDate: selectedDate.fullDate.toISOString(),
        timeSlot: selectedTimeSlot,
        consultationFee: doctor.consultationFee,
        symptoms: "",
        cancellationReason: null,
      });

      setSuccessAppointmentId(newApt._id);
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#16587b] text-white shadow-xs">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Book Consultation
              </h2>
              <p className="text-xs text-slate-500">
                {doctor.user.name} • {doctor.specialization.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        {successAppointmentId ? (
          /* SUCCESS STATE */
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200 mb-2">
                Status: Pending Doctor Review
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Appointment Request Submitted!
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                Your consultation request has been logged. The clinic will review and confirm your slot.
              </p>
            </div>

            {/* Visit Details Box */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4.5 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-800">{doctor.user.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-bold text-slate-800">
                  {selectedDate.shortDay}, {selectedDate.month} {selectedDate.dateNum} • {selectedTimeSlot}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Clinic Address:</span>
                <span className="font-medium text-slate-700 truncate max-w-[260px]">
                  {doctor.clinicAddress.street}, {doctor.clinicAddress.city}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500 font-semibold">Consultation Fee:</span>
                <span className="font-bold text-emerald-700 text-sm">
                  ₹{doctor.consultationFee} (Pay at Clinic)
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/patient/appointments");
                }}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#16587b] px-4 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#124662] transition"
              >
                <span>View in My Appointments</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto rounded-xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING FORM */
          <form onSubmit={handleSubmitBooking} className="p-6 sm:p-7 space-y-6">
            
            {/* STEP 1: Date Picker */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16587b] text-white text-[10px] font-bold">1</span>
                  <span>Select Date</span>
                </label>
                <span className="text-[11px] font-medium text-slate-400">
                  Next 14 Days
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
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
                      className={`flex flex-col items-center justify-center rounded-2xl py-2.5 px-3 min-w-[62px] border transition-all text-center ${
                        isSelected
                          ? "bg-[#16587b] text-white border-[#16587b] shadow-md scale-102"
                          : d.isAvailable
                          ? "bg-white text-slate-700 border-slate-200 hover:border-[#84b3ce] hover:bg-slate-50"
                          : "bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed opacity-40"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase">{d.shortDay}</span>
                      <span className="text-base font-extrabold my-0.5">{d.dateNum}</span>
                      <span className="text-[9px] font-medium opacity-80">{d.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Time Slot Grid */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16587b] text-white text-[10px] font-bold">2</span>
                  <span>Available Time Slot</span>
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  {availableSlots.length} slots available
                </span>
              </div>

              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`rounded-xl py-2 px-2.5 text-xs font-semibold transition text-center border ${
                          isSelected
                            ? "bg-[#16587b] text-white border-[#16587b] shadow-xs ring-2 ring-[#84b3ce]/40"
                            : "bg-slate-50/70 text-slate-700 border-slate-200 hover:border-[#84b3ce] hover:bg-white"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
                  <p className="text-xs font-semibold text-amber-900">
                    Clinic closed or no open slots on this date.
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Please choose another date above.
                  </p>
                </div>
              )}
            </div>

            {/* STEP 3: Fee Confirmation Banner ("₹800 • Pay Directly at Clinic") */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>₹{doctor.consultationFee} • Pay Directly at Clinic</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Zero online prepayment required. Pay at the clinic counter upon arrival.
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Total Due
                </span>
                <span className="block text-base font-extrabold text-emerald-900">
                  ₹{doctor.consultationFee}
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!selectedTimeSlot || submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#16587b] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#124662] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Booking Appointment..." : "Confirm & Request Appointment"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

