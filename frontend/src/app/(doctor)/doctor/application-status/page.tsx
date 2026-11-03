"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkApplicationStatus } from "@/services/doctorApi";

type ApplicationStatusState = {
  status: "pending" | "approved" | "rejected" | "needs_correction" | "not_submitted" | string;
  rejectionReason?: string | null;
  correctionReason?: string | null;
  submittedAt?: string | null;
};

export default function ApplicationStatusPage() {
  const router = useRouter();

  const [applicationData, setApplicationData] = useState<ApplicationStatusState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function fetchStatus() {
      try {
        setIsLoading(true);
        setError("");

        // Call the central Axios instance helper
        const response = await checkApplicationStatus();

        if (!isActive) return;

        if (response?.success) {
          const currentStatus = (response.status || "not_submitted").toLowerCase();

          setApplicationData({
            status: currentStatus,
            rejectionReason: response.rejectionReason,
            correctionReason: response.correctionReason,
            submittedAt: response.submittedAt,
          });

          // Automatic redirects based on verification state
          if (currentStatus === "approved") {
            router.replace("/doctor/dashboard");
            return;
          }

          if (currentStatus === "not_submitted" || currentStatus === "draft") {
            router.replace("/doctor/application");
            return;
          }
        } else {
          throw new Error("Unable to retrieve application status.");
        }
      } catch (err: any) {
        console.error("Status loading error:", err);
        if (isActive) {
          setError(
            err?.response?.data?.message ||
              "Unable to load your application status. Please try again."
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchStatus();

    return () => {
      isActive = false;
    };
  }, [router]);

  const handleLogout = () => {
    // Navigate back to auth login
    router.replace("/auth/login");
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <span className="loading loading-spinner loading-lg text-[#2563eb]" />
      </main>
    );
  }

  if (error || !applicationData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#172033]">
            Unable to load status
          </h1>

          <p className="mt-3 text-sm text-[#64748b]">
            {error || "Application record not found."}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const { status, rejectionReason, correctionReason, submittedAt } = applicationData;

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10 text-[#172033] sm:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#172033]"
          >
            Medi<span className="text-[#2563eb]">Connect</span>
          </Link>

          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* Status Card */}
        <section className="mt-12 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-bold tracking-wider text-[#2563eb] uppercase">
            Doctor Verification Portal
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-[#172033]">
            Doctor Application
          </h1>

          <p className="mt-2 text-sm text-[#64748b]">
            Track the verification and authorization status of your medical application.
          </p>

          {/* Status: Pending */}
          {status === "pending" && (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
              <p className="text-xs font-bold tracking-wider text-amber-800 uppercase">
                Application Status
              </p>

              <h2 className="mt-2 text-2xl font-bold text-amber-900">
                Under Review
              </h2>

              <p className="mt-3 text-sm leading-6 text-amber-800">
                Your application has been submitted successfully and is currently under review by the MediConnect administration team. You will be granted full access to your doctor portal once verified.
              </p>

              {submittedAt && (
                <p className="mt-4 text-xs font-medium text-amber-900">
                  Submitted on:{" "}
                  {new Date(submittedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          )}

          {/* Status: Needs Correction */}
          {status === "needs_correction" && (
            <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 p-6">
              <p className="text-xs font-bold tracking-wider text-orange-800 uppercase">
                Application Status
              </p>

              <h2 className="mt-2 text-2xl font-bold text-orange-900">
                Action Required
              </h2>

              <p className="mt-3 text-sm leading-6 text-orange-800">
                The verification team has requested updates or corrections to your submitted documents before approving your profile.
              </p>

              {correctionReason && (
                <div className="mt-4 rounded-lg border border-orange-200 bg-white p-4">
                  <p className="text-xs font-bold text-orange-900 uppercase">Admin Feedback:</p>
                  <p className="mt-1 text-sm text-orange-800">{correctionReason}</p>
                </div>
              )}

              <Link
                href="/doctor/application"
                className="mt-6 inline-flex rounded-lg bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
              >
                Update & Resubmit Application →
              </Link>
            </div>
          )}

          {/* Status: Rejected */}
          {status === "rejected" && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
              <p className="text-xs font-bold tracking-wider text-red-800 uppercase">
                Application Status
              </p>

              <h2 className="mt-2 text-2xl font-bold text-red-900">
                Application Not Approved
              </h2>

              <p className="mt-3 text-sm leading-6 text-red-800">
                Your application was reviewed and could not be verified at this time.
              </p>

              {rejectionReason && (
                <div className="mt-4 rounded-lg border border-red-200 bg-white p-4">
                  <p className="text-xs font-bold text-red-900 uppercase">Rejection Reason:</p>
                  <p className="mt-1 text-sm text-red-800">{rejectionReason}</p>
                </div>
              )}

              <Link
                href="/doctor/application"
                className="mt-6 inline-flex rounded-lg bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
              >
                Review Application Details
              </Link>
            </div>
          )}

          {/* Status: Approved */}
          {status === "approved" && (
            <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
              <h2 className="text-2xl font-bold text-green-900">
                Application Approved!
              </h2>

              <p className="mt-3 text-sm text-green-800">
                Your profile is verified. You can now access your doctor dashboard.
              </p>

              <Link
                href="/doctor/dashboard"
                className="mt-5 inline-flex rounded-lg bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
              >
                Go to Dashboard →
              </Link>
            </div>
          )}

          {/* Fallback for unsubmitted applications */}
          {!["pending", "needs_correction", "rejected", "approved"].includes(status) && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-[#172033]">
                Application Not Submitted
              </h2>

              <p className="mt-3 text-sm text-[#64748b]">
                Please complete and submit your professional credentials to initiate background verification.
              </p>

              <Link
                href="/doctor/application"
                className="mt-5 inline-flex rounded-lg bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
              >
                Start Application →
              </Link>
            </div>
          )}

          <div className="mt-8 border-t border-[#e2e8f0] pt-6">
            <p className="text-xs text-[#64748b]">
              Questions regarding verification? Contact support at <span className="text-[#2563eb] underline">support@mediconnect.com</span>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}