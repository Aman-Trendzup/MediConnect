"use client";

import React, { useState } from "react";
import { Star, X, Send, Check, AlertCircle } from "lucide-react";
import { patientApi } from "@/services/patientApi";

export const CLINICAL_TAGS = [
  "Punctual",
  "Clear Explanation",
  "Polite Staff",
  "Clean Clinic",
  "Accurate Diagnosis",
  "Attentive Care",
];

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any | null;
  onSuccess: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Punctual",
    "Clear Explanation",
  ]);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // State for replacing native browser alert with UI modal message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Strict Eligibility Check: Must be completed and not yet reviewed
  if (!isOpen || !appointment) return null;
  const isEligible = appointment.status === "completed" && !appointment.hasReviewed;
  if (!isEligible) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getRatingDescription = (score: number) => {
    switch (score) {
      case 1:
        return "1 Star • Poor experience";
      case 2:
        return "2 Stars • Fair";
      case 3:
        return "3 Stars • Good consultation";
      case 4:
        return "4 Stars • Very Good";
      case 5:
        return "5 Stars • Excellent service";
      default:
        return "";
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      setSubmitting(true);

      // Combine clinical tags and comment for full feedback
      const formattedTags = selectedTags.length > 0 ? `[${selectedTags.join(", ")}] ` : "";
      const fullReviewComment = `${formattedTags}${comment.trim()}`.trim();

      // Correctly using patientApi.createReview(appointmentId, { rating, comment })
      const response = await patientApi.createReview(appointment._id, {
        rating,
        comment: fullReviewComment || undefined,
      });

      if (response?.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      // Replaces browser alert with a clean UI notification message
      const errMsg =
        err?.response?.data?.message ||
        "You have already submitted a review for this appointment.";
      setErrorMessage(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
            <h3 className="text-base font-bold text-slate-900">Doctor Review & Rating</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Doctor Info (Fixed broken text artifacts) */}
        <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-900">
            {appointment.doctor?.user?.name}
          </p>
          <p className="text-slate-500">
            {appointment.doctor?.specialization?.name || "Specialist"} • Visited on{" "}
            {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Custom UI Error Modal state (Replaces Browser Alert) */}
        {errorMessage ? (
          <div className="space-y-4 py-4 text-center animate-in fade-in duration-150">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <AlertCircle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Notice</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">{errorMessage}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                onClose();
              }}
              className="w-full rounded-xl bg-[#16587b] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#124662] transition cursor-pointer"
            >
              Okay, Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            
            {/* 1 to 5 Star Interactive Rating */}
            <div className="text-center py-1 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Rate your overall experience:
              </label>

              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-120 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          isFilled
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 hover:text-amber-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <p className="text-xs font-semibold text-amber-800">
                {getRatingDescription(hoverRating || rating)}
              </p>
            </div>

            {/* Clinical Feedback Tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Clinical Feedback Tags
              </label>

              <div className="flex flex-wrap gap-2">
                {CLINICAL_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer border ${
                        isSelected
                          ? "bg-[#16587b] text-white border-[#16587b] shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-[#84b3ce] hover:bg-slate-50"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text Comment */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Written Review (Optional)
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details about the consultation, doctor's guidance, or clinic atmosphere..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#16587b] focus:outline-none focus:ring-1 focus:ring-[#16587b]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#16587b] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#124662] transition disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submitting ? "Publishing..." : "Publish Review"}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}