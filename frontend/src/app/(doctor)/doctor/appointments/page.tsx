"use client";

import { useEffect, useState } from "react";
import { getAllAppointments, updateAppointmentStatus } from "@/services/doctorApi";

type AppointmentStatus = "pending" | "accepted" | "completed" | "cancelled" | "rejected";

interface Patient {
  _id: string;
  name: string;
  email: string;
}

interface Appointment {
  _id: string;
  patient: Patient;
  doctor: string;
  appointmentDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  cancellationReason: string | null;
  consultationFee: number;
  createdAt: string;
  updatedAt: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load appointments on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getAllAppointments();

        if (response?.success && Array.isArray(response.appointments)) {
          setAppointments(response.appointments);
        } else {
          throw new Error("Failed to load appointments");
        }
      } catch (err: any) {
        console.error("Error loading appointments:", err);
        setError(err?.response?.data?.message || "Unable to load appointments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Handle Accept appointment status update
  const handleAccept = async () => {
    if (!selectedAppointment) return;

    setIsUpdating(true);
    try {
      const response = await updateAppointmentStatus(selectedAppointment._id, {
        status: "accepted",
      });

      if (response?.success) {
        setAppointments((prev) =>
          prev.map((appt) => (appt._id === selectedAppointment._id ? response.appointment || { ...appt, status: "accepted" } : appt))
        );
        setShowReview(false);
        setSelectedAppointment(null);
      }
    } catch (err: any) {
      console.error("Error accepting appointment:", err);
      alert(err?.response?.data?.message || "Unable to accept this appointment.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Complete appointment status update
  const handleComplete = async (appointmentId: string) => {
    setIsUpdating(true);
    try {
      const response = await updateAppointmentStatus(appointmentId, {
        status: "completed",
      });

      if (response?.success) {
        setAppointments((prev) =>
          prev.map((appt) => (appt._id === appointmentId ? response.appointment || { ...appt, status: "completed" } : appt))
        );
        if (selectedAppointment?._id === appointmentId) {
          setShowReview(false);
          setSelectedAppointment(null);
        }
      }
    } catch (err: any) {
      console.error("Error completing appointment:", err);
      alert(err?.response?.data?.message || "Unable to mark this appointment as completed.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Reject / Cancel appointment status update
  const handleReject = async () => {
    if (!selectedAppointment || !rejectionReason.trim()) return;

    setIsUpdating(true);
    try {
      const response = await updateAppointmentStatus(selectedAppointment._id, {
        status: "cancelled",
        cancellationReason: rejectionReason.trim(),
      });

      if (response?.success) {
        setAppointments((prev) =>
          prev.map((appt) => (appt._id === selectedAppointment._id ? response.appointment || { ...appt, status: "cancelled", cancellationReason: rejectionReason.trim() } : appt))
        );
        setShowRejectDialog(false);
        setShowReview(false);
        setSelectedAppointment(null);
        setRejectionReason("");
      }
    } catch (err: any) {
      console.error("Error rejecting appointment:", err);
      alert(err?.response?.data?.message || "Unable to reject this appointment.");
    } finally {
      setIsUpdating(false);
    }
  };

  const tabs = ["All", "pending", "accepted", "completed", "cancelled"];

  const filteredAppointments =
    activeTab === "All"
      ? appointments
      : appointments.filter((appt) => appt.status.toLowerCase() === activeTab.toLowerCase());

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f8fafc]">
        <span className="loading loading-spinner loading-lg text-[#2563eb]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mt-1 text-3xl font-extrabold text-[#172033] sm:text-4xl">
            Appointments
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
                activeTab.toLowerCase() === tab.toLowerCase()
                  ? "bg-primary text-white shadow-md"
                  : "border border-primary bg-white text-primary hover:border-slate-800 hover:text-border-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Appointment list container */}
        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b border-[#e2e8f0] pb-4">
            <h2 className="text-lg font-bold text-[#172033] capitalize">
              {activeTab === "All" ? "All appointments" : `${activeTab} appointments`}
            </h2>
            <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-600">
              {filteredAppointments.length} record{filteredAppointments.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-[#64748b]">No appointments found.</p>
                <p className="mt-1 text-xs text-slate-400">Try switching tabs or check back later.</p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => {
                const initials = appointment.patient?.name
                  ? appointment.patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "PT";

                return (
                  <div
                    key={appointment._id}
                    className="flex flex-col gap-4 rounded-xl border border-[#e2e8f0] bg-white p-5 transition hover:border-blue-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-white">
                        {initials}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[#172033]">
                            {appointment.patient?.name || "Unknown Patient"}
                          </h3>
                          <span className="text-xs text-slate-400">({appointment.patient?.email})</span>
                        </div>

                        <p className="text-sm font-medium text-[#64748b]">
                           {new Date(appointment.appointmentDate).toLocaleDateString()} &nbsp;·&nbsp; {appointment.timeSlot}
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
                          <span>Consultation Fee: <strong className="text-[#172033]">₹{appointment.consultationFee}</strong></span>
                        </div>

                        {appointment.cancellationReason && (
                          <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-3">
                            <p className="text-xs font-bold text-red-800">Reason / Notes</p>
                            <p className="mt-0.5 text-xs text-red-700">
                              {appointment.cancellationReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          appointment.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : appointment.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appointment.status}
                      </span>

                      {appointment.status === "pending" && (
                        <button
                          className="rounded-lg bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowReview(true);
                          }}
                        >
                          Review
                        </button>
                      )}

                      {appointment.status === "accepted" && (
                        <button
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                          onClick={() => handleComplete(appointment._id)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Updating..." : "Mark Completed"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Review appointment modal */}
        {showReview && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
                <h2 className="text-lg font-bold text-[#172033]">Review Appointment Request</h2>
                <button
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => setShowReview(false)}
                  aria-label="Close review"
                >
                  ✕
                </button>
              </div>

              <div className="my-6 space-y-4 text-sm">
                <div className="rounded-xl bg-slate-50 p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Patient Name:</span>
                    <span className="font-semibold text-[#172033]">{selectedAppointment.patient?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-medium text-[#172033]">{selectedAppointment.patient?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date & Slot:</span>
                    <span className="font-medium text-[#172033]">
                      {new Date(selectedAppointment.appointmentDate).toLocaleDateString()} ({selectedAppointment.timeSlot})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consultation Fee:</span>
                    <span className="font-semibold text-green-600">₹{selectedAppointment.consultationFee}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Status:</span>
                  <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800 capitalize">
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#e2e8f0] pt-4">
                <button
                  className="rounded-lg border border-[#e2e8f0] px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  onClick={() => setShowReview(false)}
                  disabled={isUpdating}
                >
                  Close
                </button>

                <button
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isUpdating}
                >
                  Reject
                </button>

                <button
                  className="rounded-lg bg-[#2563eb] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
                  onClick={handleAccept}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Processing..." : "Accept Request"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject appointment modal */}
        {showRejectDialog && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <h2 className="text-lg font-bold text-[#172033]">Reject Appointment</h2>
              <p className="mt-1 text-sm text-[#64748b]">
                You are about to decline the consultation request for <strong className="text-[#172033]">{selectedAppointment.patient?.name}</strong>.
              </p>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-bold text-[#172033] uppercase tracking-wide">
                  Reason for Rejection *
                </label>
                <textarea
                  className="w-full rounded-xl border border-[#e2e8f0] p-3 text-sm text-[#172033] placeholder:text-slate-400 focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
                  rows={4}
                  placeholder="Explain why you cannot accept this appointment slot..."
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#e2e8f0] pt-4">
                <button
                  className="rounded-lg border border-[#e2e8f0] px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  onClick={() => {
                    setShowRejectDialog(false);
                    setRejectionReason("");
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </button>

                <button
                  className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition hover:bg-red-700 disabled:opacity-50"
                  disabled={!rejectionReason.trim() || isUpdating}
                  onClick={handleReject}
                >
                  {isUpdating ? "Processing..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}