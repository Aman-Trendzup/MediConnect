'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { DashboardWrapper } from '@/components/dashboardWrapper';
import { adminApi } from '@/services/adminApi';
import { 
  Users, 
  HeartHandshake, 
  Calendar, 
  Clock, 
  CalendarCheck, 
  CheckCircle2, 
  XCircle,  
  ArrowUpRight, 
  Activity,
  Loader2 
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  counts: {
    totalUsers: number;
    totalDoctors: number;
    totalPatients: number;
    pendingApplications: number;
    totalAppointments: number;
    totalCategories: number;
    approvedApplications?: number;
    rejectedApplications?: number;
    totalApplications?: number;
  };
  recentAppointments: {
    _id: string;
    patient?: { name: string; email: string };
    doctor?: { name: string; email: string };
    appointmentDate?: string;
    type?: string;
    status?: string;
  }[];
  recentAuditLogs: {
    _id: string;
    action: string;
    createdAt: string;
    user?: {
      name: string;
      email: string;
      role: string;
    };
  }[];
}

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await adminApi.getDashboardStats(); // Or your exact adminApi method name
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error: any) {
        console.error("Failed to fetch dashboard stats:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <DashboardWrapper>
        <div className="flex flex-col items-center justify-center py-32 text-secondary gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-xs font-semibold">Loading dashboard overview...</p>
        </div>
      </DashboardWrapper>
    );
  }

  const counts = dashboardData?.counts || {
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    pendingApplications: 0,
    totalAppointments: 0,
    totalCategories: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalApplications: 0,
  };

  const recentAppointments = dashboardData?.recentAppointments || [];
  const recentAuditLogs = dashboardData?.recentAuditLogs || [];

  return (
    <DashboardWrapper>
      <Suspense fallback={null}>
        <div className="space-y-6 text-secondary">
          
          {/* TOP METRIC CARDS (2x2 GRID) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* total doctors */}
            <div className="flex items-center justify-start gap-4 rounded-2xl border border-secondary bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary shrink-0">
                <HeartHandshake className="h-8 w-8" />
              </div> 
              <Link href="/admin/users?role=doctor">
                <div className="flex flex-col items-start text-left cursor-pointer">
                  <span className="text-4xl font-extrabold text-primary leading-none">{counts.totalDoctors}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary mt-1">Total Doctors</span>
                </div>
              </Link>
            </div>

            {/* Total Patient */}
            <div className="flex items-center justify-start gap-4 rounded-2xl border border-secondary bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary shrink-0">
                <Users className="h-8 w-8" />
              </div>
              <Link href="/admin/users?role=patient">
                <div className='flex flex-col items-start text-left cursor-pointer'>
                  <span className="text-4xl font-extrabold text-primary leading-none">{counts.totalPatients}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary mt-1">Total Patients</span>
                </div>
              </Link>
            </div>

            {/* Total Appointment */}
            <div className="flex items-center justify-start gap-4 rounded-2xl border border-secondary bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary shrink-0">
                <Calendar className="h-8 w-8" />
              </div>
              <Link href="/admin/appointments">
                <div className='flex flex-col items-start text-left cursor-pointer'>
                  <span className="text-3xl font-extrabold text-primary">{counts.totalAppointments}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary mt-1">Total Appointments</span>
                </div>
              </Link>
            </div>

            {/* Pending Applications */}
            <div className="flex items-center justify-start gap-4 rounded-2xl border border-secondary bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-100 shrink-0">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <Link href="/admin/applications?status=pending">
                <div className='flex flex-col items-start text-left cursor-pointer'>
                  <span className="text-3xl font-extrabold text-amber-600">{counts.pendingApplications}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 mt-1">Pending Applications</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Applications summary */}
          <div className="rounded-2xl border border-secondary bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-1.5 text-md font-bold tracking-wide uppercase text-primary">
                Applications Summary
              </div>
              <Link href="/admin/applications"
                className="flex items-center gap-1 rounded-full bg-primary hover:bg-secondary text-white px-3.5 py-1 text-xs font-bold transition">
                view all
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-1 flex items-center gap-4 rounded-2xl bg-primary text-white p-5 shadow-md">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold leading-tight">{counts.totalApplications || (counts.pendingApplications + (counts.approvedApplications || 0) + (counts.rejectedApplications || 0))}</span>
                  <span className="text-xs font-medium uppercase tracking-wider opacity-90 mt-0.5">Total Applications</span>
                </div>
              </div>

              {/* Right Sub-status Grid */}
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Pending */}
                <div className="flex items-center gap-3 rounded-xl border border-amber-200/80 bg-amber-50/40 p-3 transition hover:bg-amber-50">
                  <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-amber-700 leading-tight">{counts.pendingApplications}</span>
                    <span className="text-xs font-semibold text-amber-900/70 truncate mt-0.5">Pending</span>
                  </div>
                </div>

                {/* Approved */}
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3 transition hover:bg-emerald-50">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-emerald-700 leading-tight">{counts.approvedApplications || 0}</span>
                    <span className="text-xs font-semibold text-emerald-900/70 truncate mt-0.5">Approved</span>
                  </div>
                </div>

                {/* Rejected */}
                <div className="flex items-center gap-3 rounded-xl border border-rose-200/80 bg-rose-50/40 p-3 transition hover:bg-rose-50">
                  <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 flex-shrink-0">
                    <XCircle className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-rose-700 leading-tight">{counts.rejectedApplications || 0}</span>
                    <span className="text-xs font-semibold text-rose-900/70 truncate mt-0.5">Rejected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT APPOINTMENTS SECTION */}
          <div className="rounded-2xl border border-secondary bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 px-4 py-1.5 text-md font-bold tracking-wide uppercase text-primary">
                Recent Appointments
              </div>
              <Link href="/admin/appointments"
                className="flex items-center gap-1 rounded-full bg-primary hover:bg-secondary text-white px-3.5 py-1 text-xs font-bold transition">
                view all
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Header Row */}
                <div className="grid grid-cols-5 bg-secondary/5 rounded-xl p-3 text-xs font-bold text-primary text-center mb-2">
                  <span>Patient</span>
                  <span>Doctor</span>
                  <span>Date & Time</span>
                  <span>Type</span>
                  <span>Status</span>
                </div>
                
                {recentAppointments.length === 0 ? (
                  <div className="text-center py-8 text-secondary/60 text-xs font-semibold">
                    No recent appointments found.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentAppointments.map((apt) => {
                      const aptDate = apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleString() : 'N/A';
                      return (
                        <div 
                          key={apt._id}
                          className="grid grid-cols-5 items-center h-12 w-full rounded-xl border border-secondary/10 px-3 text-xs font-medium text-secondary text-center bg-secondary/5"
                        >
                          <span className="font-bold text-primary truncate px-1">{apt.patient?.name || 'Patient'}</span>
                          <span className="font-semibold text-primary truncate px-1">{apt.doctor?.name || 'Doctor'}</span>
                          <span className="text-secondary truncate px-1">{aptDate}</span>
                          <span className="capitalize">{apt.type || 'Consultation'}</span>
                          <div>
                            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                              {apt.status || 'Scheduled'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audit LOGS SECTION */}
          <div className="rounded-2xl border border-secondary bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="flex items-center gap-2 px-4 py-1.5 text-md font-bold tracking-wide uppercase text-primary inline-flex">
                Audit Logs
              </span>   
              <Link href="/admin/audit-logs"
                className="flex items-center gap-1 rounded-full bg-primary hover:bg-secondary text-white px-3.5 py-1 text-xs font-bold transition">
                view all
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Activity Logs List */}
            {recentAuditLogs.length === 0 ? (
              <div className="text-center py-8 text-secondary/60 text-xs font-semibold">
                No recent audit logs recorded.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentAuditLogs.map((log) => {
                  const logTime = new Date(log.createdAt).toLocaleString();
                  return (
                    <div 
                      key={log._id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-xl border border-secondary/10 bg-secondary/5 p-3.5 text-xs"
                    >
                      <div>
                        <p className="font-bold text-primary">{log.action}</p>
                        <p className="text-secondary/70 mt-0.5">
                          Triggered by: <span className="font-semibold text-primary">{log.user?.name || 'System Admin'}</span> ({log.user?.email || 'admin'})
                        </p>
                      </div>
                      <span className="text-[13px] font-medium text-secondary bg-white px-2.5 py-1 ">
                        {logTime}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </Suspense>
    </DashboardWrapper>
  );
}