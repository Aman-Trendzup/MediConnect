"use client";

import React, { useState } from "react";
import { AlertCircle, X, ShieldCheck } from "lucide-react";
import { patientApi } from "@/services/patientApi";

export const CANCEL_REASONS = [
  "Schedule Conflict",
  "Booked Another Doctor",
  "Health Issue Resolved",
  "Other",
] as const;

type CancelReason = (typeof CANCEL_REASONS)[number];

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  onSuccess: (updatedApt: any) => void;
}

export default function CancelModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: CancelModalProps) {
  const [selectedReason, setSelectedReason] = useState<CancelReason>("Schedule Conflict");
  const [customNote, setCustomNote] = useState<string>("");
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !appointment) return null;

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCancelling(true);
      setError(null);

      // Build the final reason string matching backend validation requirements
      const finalReason =
        selectedReason === "Other" && customNote.trim()
          ? `Other: ${customNote.trim()}`
          : customNote.trim()
          ? `${selectedReason} - ${customNote.trim()}`
          : selectedReason;

      const response = await patientApi.cancelAppointment(appointment._id, finalReason);

      // Your controller returns { success: true, message: "...", updatedAppointment }
      const updatedApt = response?.updatedAppointment || response?.appointment || response?.data || response;

      if (updatedApt) {
        onSuccess(updatedApt);
      }
      onClose();
    } catch (err: any) {
      console.error("Cancellation error:", err);
      setError(
        err?.response?.data?.message ||
          "An error occurred while cancelling appointment."
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
            <AlertCircle className="h-5 w-5" />
            <span>Cancel Appointment</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Appointment Context */}
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-xs text-slate-700 space-y-1">
          <p className="font-semibold text-slate-900">
            Consultation with {appointment?.doctor?.user?.name || "Doctor"}
          </p>
          <p className="text-slate-500">
            {appointment?.appointmentDate
              ? new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}{" "}
            • {appointment?.timeSlot || ""}
          </p>
          <p className="text-[11px] text-slate-400">
            {appointment?.doctor?.clinicAddress?.street}, {appointment?.doctor?.clinicAddress?.city}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleConfirmCancel} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Reason for Cancellation *
            </label>

            {/* Radio Options */}
            <div className="space-y-2">
              {CANCEL_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-xs font-semibold cursor-pointer transition ${
                      isSelected
                        ? "border-[#16587b] bg-[#16587b]/5 text-[#16587b] shadow-2xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={isSelected}
                      onChange={() => setSelectedReason(reason)}
                      className="h-4 w-4 text-[#16587b] focus:ring-[#84b3ce]"
                    />
                    <span>{reason}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Optional / Other Comment */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">
              {selectedReason === "Other" ? "Please specify reason *" : "Additional Note (Optional):"}
            </label>
            <textarea
              rows={2}
              required={selectedReason === "Other"}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder={
                selectedReason === "Other"
                  ? "Describe your reason for cancellation..."
                  : "Add any extra details for the clinic..."
              }
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-[#16587b] focus:outline-none"
            />
          </div>

          {/* Pay at Clinic Notice */}
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 border border-slate-100">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Pay at Clinic policy: No cancellation fees apply.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Keep Appointment
            </button>
            <button
              type="submit"
              disabled={cancelling}
              className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition disabled:opacity-50"
            >
              {cancelling ? "Cancelling..." : "Confirm Cancellation"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}