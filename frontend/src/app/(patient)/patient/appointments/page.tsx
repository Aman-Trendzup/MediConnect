"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Clock3,
  Star,
  Search,
  RotateCcw,
  X,
  ShieldCheck,
  AlertCircle,
  CheckCheck,
} from "lucide-react";
import { patientApi } from "@/services/patientApi";
import CancelModal from "@/components/CancelModal";
import RescheduleModal from "@/components/RescheduleModal";
import ReviewModal from "@/components/ReviewModal";
import BookingModal, { BookingDoctorData } from "@/components/BookingModal";

type ActiveTab = "upcoming" | "completed" | "cancelled";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("upcoming");

  // Selected appointments for action modals
  const [cancelTargetApt, setCancelTargetApt] = useState<any | null>(null);
  const [rescheduleTargetApt, setRescheduleTargetApt] = useState<any | null>(null);
  const [reviewTargetApt, setReviewTargetApt] = useState<any | null>(null);

  // Re-book State
  const [rebookDoctor, setRebookDoctor] = useState<BookingDoctorData | null>(null);
  const [isRebookModalOpen, setIsRebookModalOpen] = useState<boolean>(false);

  // Notification, Error, and Already Reviewed Modal States
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null);
  const [alreadyReviewedApt, setAlreadyReviewedApt] = useState<any | null>(null);

  const showNotificationToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => {
      setActionSuccessMsg(null);
    }, 4000);
  };

  // Fetch appointments using patientApi.getAllAppointments(status)
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);

      let response;
      if (activeTab === "upcoming") {
        response = await patientApi.getAllAppointments();
      } else if (activeTab === "completed") {
        response = await patientApi.getAllAppointments("completed");
      } else if (activeTab === "cancelled") {
        response = await patientApi.getAllAppointments("cancelled");
      }

      const list: any[] =
        response?.appointments || response?.data || (Array.isArray(response) ? response : []);

      if (activeTab === "upcoming") {
        setAppointments(list.filter((a) => a.status === "pending" || a.status === "accepted"));
      } else {
        setAppointments(list);
      }
    } catch (err: any) {
      console.error("Error loading appointments:", err);
      setErrorModalMsg(err?.response?.data?.message || "Failed to load appointments list.");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadAppointments();

    const handleUpdate = () => {
      loadAppointments();
    };

    window.addEventListener("mediconnect_patient_change", handleUpdate);
    return () => {
      window.removeEventListener("mediconnect_patient_change", handleUpdate);
    };
  }, [loadAppointments]);

  // Open Review modal or trigger Already Reviewed popup if already reviewed
  const handleOpenReview = (apt: any) => {
    if (apt.hasReviewed) {
      setAlreadyReviewedApt(apt);
    } else {
      setReviewTargetApt(apt);
    }
  };

  // Open Re-book modal pre-filled with doctor info
  const handleOpenRebook = (apt: any) => {
    setRebookDoctor({
      _id: apt.doctor._id,
      user: {
        name: apt.doctor.user.name,
        email: apt.doctor.user.email,
        avatar: apt.doctor.user.avatar,
      },
      specialization: {
        name: apt.doctor.specialization.name,
      },
      qualifications: apt.doctor.qualifications || [],
      experienceYears: apt.doctor.experienceYears || 0,
      clinicAddress: apt.doctor.clinicAddress || { street: "", city: "", state: "", pincode: "" },
      consultationFee: apt.consultationFee,
      averageRating: apt.doctor.averageRating || 0,
      totalReviews: apt.doctor.totalReviews || 0,
    });
    setIsRebookModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock3 className="h-3.5 w-3.5" />
            Pending Doctor Review
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-3.5 w-3.5" />
            Confirmed (Upcoming)
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 border border-sky-200">
            <CheckCircle className="h-3.5 w-3.5" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
            <XCircle className="h-3.5 w-3.5" />
            Cancelled / Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
           Your Appointments 
          </h1>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tabbed Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "upcoming"
              ? "bg-[#16587b] text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Upcoming</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "completed"
              ? "bg-[#16587b] text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          <span>Completed</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cancelled")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "cancelled"
              ? "bg-[#16587b] text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <XCircle className="h-4 w-4" />
          <span>Cancelled / Rejected</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-800">
            {activeTab === "upcoming"
              ? "No Upcoming Appointments"
              : activeTab === "completed"
              ? "No Past Completed Consultations"
              : "No Cancelled Appointments"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {activeTab === "upcoming"
              ? "You do not have any pending or confirmed bookings at the moment."
              : activeTab === "completed"
              ? "Once your appointments are marked completed by the doctor, you can review them here."
              : "No appointments have been cancelled or rejected."}
          </p>
          <div className="mt-5">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 rounded-xl bg-[#16587b] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#124662] transition"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Browse Doctors</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt._id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300 sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Doctor and Clinic Info */}
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#16587b]/10 text-[#16587b] font-bold text-lg overflow-hidden border border-slate-200">
                    {apt.doctor?.user?.avatar ? (
                      <img
                        src={apt.doctor.user.avatar}
                        alt={apt.doctor.user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      apt.doctor?.user?.name?.charAt(0) || "D"
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/doctors/${apt.doctor?._id}`}
                        className="text-base font-bold text-slate-900 hover:text-[#16587b] transition"
                      >
                        {apt.doctor?.user?.name}
                      </Link>
                      {apt.doctor?.specialization?.name && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {apt.doctor.specialization.name}
                        </span>
                      )}
                    </div>

                    {apt.doctor?.qualifications && (
                      <p className="text-xs text-slate-500">
                        {Array.isArray(apt.doctor.qualifications)
                          ? apt.doctor.qualifications.join(", ")
                          : apt.doctor.qualifications}{" "}
                        • {apt.doctor.experienceYears || 0} yrs experience
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Calendar className="h-3.5 w-3.5 text-[#16587b]" />
                        <span>
                          {new Date(apt.appointmentDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Clock className="h-3.5 w-3.5 text-[#16587b]" />
                        <span>{apt.timeSlot}</span>
                      </div>

                      {apt.doctor?.clinicAddress?.street && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span className="truncate max-w-[240px]">
                            {apt.doctor.clinicAddress.street}, {apt.doctor.clinicAddress.city}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Status and Fee */}
                <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                  {getStatusBadge(apt.status)}

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Consultation Fee
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{apt.consultationFee}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-semibold">
                      Pay at Clinic
                    </span>
                  </div>
                </div>
              </div>

              {/* UPCOMING ACTIONS */}
              {activeTab === "upcoming" && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5 text-[#16587b]" />
                    <span>
                      {apt.status === "pending"
                        ? "Awaiting doctor's approval for this slot."
                        : "Slot confirmed. Please arrive 10 mins early."}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setRescheduleTargetApt(apt)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-[#16587b]" />
                      <span>Reschedule</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCancelTargetApt(apt)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-3.5 py-2 text-xs font-bold text-rose-700 shadow-2xs hover:bg-rose-100/70 transition cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5 text-rose-600" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              {/* COMPLETED ACTIONS */}
              {activeTab === "completed" && (
                <div className="mt-4 border-t border-slate-100 pt-3">
                  {!apt.hasReviewed ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/60">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                        <div>
                          <p className="text-xs font-bold text-amber-900">
                            How was your consultation with {apt.doctor?.user?.name}?
                          </p>
                          <p className="text-[11px] text-amber-700">
                            Your feedback helps other patients make informed health choices.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenReview(apt)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#16587b] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#124662] transition cursor-pointer"
                      >
                        <Star className="h-3.5 w-3.5" />
                        <span>Write a Review</span>
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3.5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < (apt.review?.rating || 5)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-slate-800">
                            You reviewed this visit ({apt.review?.rating || 5}/5 Stars)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenReview(apt)}
                          className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/70 px-2.5 py-1 rounded-full transition cursor-pointer"
                        >
                          View Review
                        </button>
                      </div>
                      {apt.review?.comment && (
                        <p className="text-xs text-slate-600 italic pt-1">
                          &quot;{apt.review.comment}&quot;
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* CANCELLED ACTIONS */}
              {activeTab === "cancelled" && (
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <div className="flex-1 rounded-2xl border border-rose-200 bg-rose-50/60 p-3 text-xs text-rose-800">
                    <span className="font-bold text-rose-900">Reason for Cancellation: </span>
                    <span>{apt.cancellationReason || "No specific note provided."}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenRebook(apt)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#16587b] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#124662] transition shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Re-book Appointment</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Modals */}
      <CancelModal
        isOpen={Boolean(cancelTargetApt)}
        onClose={() => setCancelTargetApt(null)}
        appointment={cancelTargetApt}
        onSuccess={() => {
          showNotificationToast("Appointment successfully cancelled.");
          loadAppointments();
          setActiveTab("cancelled");
        }}
      />

      <RescheduleModal
        isOpen={Boolean(rescheduleTargetApt)}
        onClose={() => setRescheduleTargetApt(null)}
        appointment={rescheduleTargetApt}
        onSuccess={() => {
          showNotificationToast("Appointment rescheduled and moved to pending confirmation.");
          loadAppointments();
          setActiveTab("upcoming");
        }}
      />

      <ReviewModal
        isOpen={Boolean(reviewTargetApt)}
        onClose={() => setReviewTargetApt(null)}
        appointment={reviewTargetApt}
        onSuccess={() => {
          showNotificationToast("Thank you! Your doctor review has been published.");
          loadAppointments();
        }}
      />

      {rebookDoctor && (
        <BookingModal
          isOpen={isRebookModalOpen}
          onClose={() => {
            setIsRebookModalOpen(false);
            setRebookDoctor(null);
          }}
          doctor={rebookDoctor}
        />
      )}

      {/* Already Reviewed Information Modal */}
      {alreadyReviewedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 border border-amber-100">
              <CheckCheck className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">Review Already Published</h3>
              <p className="text-xs text-slate-600">
                You have already submitted feedback for your consultation with{" "}
                <span className="font-semibold text-slate-800">
                  {alreadyReviewedApt.doctor?.user?.name}
                </span>.
              </p>

              {alreadyReviewedApt.review && (
                <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-left border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < (alreadyReviewedApt.review?.rating || 5)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-bold text-slate-700 ml-1">
                      {alreadyReviewedApt.review?.rating || 5}/5 Stars
                    </span>
                  </div>
                  {alreadyReviewedApt.review?.comment && (
                    <p className="text-xs text-slate-600 italic">
                      &quot;{alreadyReviewedApt.review.comment}&quot;
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setAlreadyReviewedApt(null)}
              className="w-full rounded-xl bg-[#16587b] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#124662] transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* General Custom Error Modal */}
      {errorModalMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertCircle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Notice</h3>
              <p className="text-xs text-slate-600">{errorModalMsg}</p>
            </div>

            <button
              type="button"
              onClick={() => setErrorModalMsg(null)}
              className="w-full rounded-xl bg-[#16587b] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#124662] transition cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}