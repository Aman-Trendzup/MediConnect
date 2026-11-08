"use client";

import React, { useState, useMemo } from "react";
import { RotateCcw, X, Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { patientApi } from "@/services/patientApi";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any | null;
  onSuccess: (updatedApt: any) => void;
}

const DEFAULT_SLOTS = [
  "09:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "02:00 PM - 02:30 PM",
  "02:30 PM - 03:00 PM",
  "03:00 PM - 03:30 PM",
  "04:00 PM - 04:30 PM",
];

export default function RescheduleModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: RescheduleModalProps) {
  // Generate 14 upcoming days for date picking
  const upcomingDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isSunday = d.getDay() === 0;
      days.push({
        isoString: d.toISOString().split("T")[0],
        fullDate: d,
        shortDay: d.toLocaleDateString("en-US", { weekday: "short" }),
        dateNum: d.getDate(),
        month: d.toLocaleDateString("en-US", { month: "short" }),
        isAvailable: !isSunday,
      });
    }
    return days;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(upcomingDays[0]?.isoString || "");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [rescheduling, setRescheduling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !appointment) return null;

  const handleConfirmReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;

    try {
      setRescheduling(true);
      setError(null);

      const response = await patientApi.rescheduleAppointment(
        appointment._id,
        selectedDate,
        selectedSlot
      );

      // Handle common response structures securely
      const updatedApt = response?.updatedAppointment || response?.appointment || response?.data || response;

      if (updatedApt) {
        onSuccess(updatedApt);
      }
      onClose();
    } catch (err: any) {
      console.error("Reschedule error:", err);
      setError(
        err?.response?.data?.message ||
          "An error occurred while rescheduling the appointment."
      );
    } finally {
      setRescheduling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#16587b]/10 text-[#16587b]">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Reschedule Appointment</h3>
              <p className="text-xs text-slate-500">{appointment?.doctor?.user?.name || "Doctor"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Slot Info */}
        <div className="rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-200/80">
          <span className="font-semibold text-slate-800">Current Slot: </span>
          {appointment?.appointmentDate
            ? new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            : ""}{" "}
          • {appointment?.timeSlot || ""}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleConfirmReschedule} className="space-y-4">
          {/* Step 1: Date Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5 text-[#16587b]" />
              <span>1. Select New Date</span>
            </label>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {upcomingDays.map((d) => {
                const isSelected = selectedDate === d.isoString;
                return (
                  <button
                    key={d.isoString}
                    type="button"
                    disabled={!d.isAvailable}
                    onClick={() => {
                      setSelectedDate(d.isoString);
                      setSelectedSlot("");
                    }}
                    className={`flex flex-col items-center justify-center rounded-2xl py-2 px-3 min-w-[62px] border transition text-center ${
                      isSelected
                        ? "bg-[#16587b] text-white border-[#16587b] shadow-xs"
                        : d.isAvailable
                        ? "bg-white text-slate-700 border-slate-200 hover:border-[#84b3ce]"
                        : "bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed opacity-40"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">{d.shortDay}</span>
                    <span className="text-base font-bold my-0.5">{d.dateNum}</span>
                    <span className="text-[9px] font-medium">{d.month}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Available Time Slot Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#16587b]" />
                <span>2. Available Time Slot</span>
              </label>
              <span className="text-[11px] text-slate-500">
                {DEFAULT_SLOTS.length} slots available
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {DEFAULT_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-xl py-2 px-2.5 text-xs font-semibold border transition text-center ${
                      isSelected
                        ? "bg-[#16587b] text-white border-[#16587b] ring-2 ring-[#84b3ce]/40"
                        : "bg-white text-slate-700 border-slate-200 hover:border-[#84b3ce]"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-sky-50/60 p-3 rounded-xl border border-sky-100">
            Rescheduling moves this consultation back to <strong>Pending</strong> status until confirmed by the doctor.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedDate || !selectedSlot || rescheduling}
              className="rounded-xl bg-[#16587b] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#124662] transition disabled:opacity-50"
            >
              {rescheduling ? "Updating Slot..." : "Confirm Reschedule"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}