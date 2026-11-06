"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDoctorDashboardStats } from "@/services/doctorApi";

interface Specialization {
  _id: string;
  name: string;
  description: string;
}

interface DoctorProfile {
  isPublished: boolean;
  consultationFee: number;
  experienceYears: number;
  averageRating: number;
  totalReviews: number;
  specialization: Specialization;
}

interface Counts {
  totalAppointments: number;
  pendingAppointments: number;
  acceptedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  activeAvailabilityDays: number;
  upcomingBlockedSlots: number;
}

interface Patient {
  _id: string;
  name: string;
  email: string;
}

interface RecentAppointment {
  _id: string;
  patient: Patient;
  doctor: string;
  appointmentDate: string;
  timeSlot: string;
  status: "pending" | "accepted" | "completed" | "cancelled";
  cancellationReason: string | null;
  consultationFee: number;
  createdAt: string;
  updatedAt: string;
}

interface DashboardData {
  profile: DoctorProfile;
  counts: Counts;
  recentAppointments: RecentAppointment[];
}

export default function DoctorDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch dashboard metrics directly via Axios API service
        const response = await getDoctorDashboardStats();

        if (response?.success && response?.dashboardData) {
          setDashboardData(response.dashboardData);
        } else {
          throw new Error("Failed to load dashboard data");
        }
      } catch (err: any) {
        console.error("Error fetching doctor dashboard stats:", err);
        setError(err?.response?.data?.message || "Unable to fetch dashboard statistics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-12 text-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          <p className="font-semibold">{error || "Failed to load dashboard"}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { profile, counts, recentAppointments } = dashboardData;

  const statCards = [
    {
      title: "Total Appointments",
      value: counts.totalAppointments,
      description: "All appointment records",
    },
    {
      title: "Pending Requests",
      value: counts.pendingAppointments,
      description: "Awaiting your response",
    },
    {
      title: "Accepted",
      value: counts.acceptedAppointments,
      description: "Appointments accepted",
    },
    {
      title: "Completed",
      value: counts.completedAppointments,
      description: "Consultations completed",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      {/* Welcome section */}
      <div>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Welcome to Your Dashboard
        </h1>
      </div>

      {/* Appointment statistics */}
      <section className="mt-8">
        <div>
          <h2 className="text-xl font-bold text-[#172033]">
            Appointment Overview
          </h2>
          <p className="mt-1 text-sm text-[#64748b]">
            A quick overview of your appointments and schedule metrics
          </p>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl border border-secondary bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-[#64748b]">{stat.title}</p>
              <p className="mt-4 text-3xl font-bold text-[#172033]">{stat.value}</p>
              <p className="mt-1 text-xs text-[#64748b]">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Appointments Section */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#172033]">Recent Appointments</h2>
            <p className="mt-1 text-sm text-[#64748b]">
              Latest booking requests and scheduled consultations.
            </p>
          </div>
          <Link
            href="/doctor/appointments"
            className="flex items-center gap-1 rounded-full bg-primary text-white hover:bg-secondary hover:text-primary px-3.5 py-1 text-xs font-bold transition"
          >
            View All 
          </Link>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-secondary bg-white shadow-sm">
          {recentAppointments && recentAppointments.length > 0 ? (
            <div className="divide-y divide-secondary">
              {recentAppointments.map((appt) => (
                <div
                  key={appt._id}
                  className="flex flex-col justify-between p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-[#172033]">{appt.patient.name}</p>
                    <p className="text-xs text-[#64748b]">{appt.patient.email}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(appt.appointmentDate).toLocaleDateString()} | {appt.timeSlot}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        appt.status === "pending"
                          ? "bg-orange-100 text-orange-800"
                          : appt.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-6 text-center text-sm text-[#64748b]">
              No recent appointments found
            </p>
          )}
        </div>
      </section>

      {/* Workspace cards */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-[#172033]">Your workspace</h2>
        <p className="mt-1 text-sm text-[#64748b]">
          Quick access to your doctor portal features
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/doctor/availability"
            className="rounded-xl border border-[#e2e8f0] bg-white p-6 transition hover:border-[#2563eb] hover:shadow-sm"
          >
            <h3 className="font-bold">Availability & Schedule</h3>
            <p className="mt-2 text-sm text-[#64748b]">
              Manage your weekly schedule ({counts.activeAvailabilityDays} active days) and blocked slots ({counts.upcomingBlockedSlots} blocked).
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-[#2563eb]">
              Manage availability 
            </span>
          </Link>

          <Link
            href="/doctor/appointments"
            className="rounded-xl border border-[#e2e8f0] bg-white p-6 transition hover:border-[#2563eb] hover:shadow-sm"
          >
            <h3 className="font-bold">Appointments</h3>
            <p className="mt-2 text-sm text-[#64748b]">
              View appointment requests and manage upcoming patient consultations
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-[#2563eb]">
              View appointments 
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}