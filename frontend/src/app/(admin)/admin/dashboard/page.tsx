
import React from 'react';
import { DashboardWrapper } from '@/components/dashboardWrapper';
import { 
  Users, 
  HeartHandshake, 
  Calendar, 
  Clock, 
  CalendarCheck, 
  CheckCircle2, 
  XCircle,  
  ArrowUpRight, 
  Activity 
} from 'lucide-react';

import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <DashboardWrapper>
      <div className="space-y-6 text-secondary">
        
        {/*  TOP METRIC CARDS (2x2 GRID)  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* total doctors */}
          <div className="flex items-center justify-start gap-4 rounded-2xl border border-secondary bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary shrink-0">
              <HeartHandshake className="h-8 w-8" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-4xl font-extrabold text-primary leading-none">9</span>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary mt-1">Total Doctors</span>
            </div>
          </div>

          {/* Total Patient */}
          <div className="flex items-center justify-start gap-4 rounded-2xl border border-secondary bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary shrink-0">
              <Users className="h-8 w-8" />
            </div>
            <div className='flex flex-col items-start text-left'>
              <span className="text-4xl font-extrabold text-primary leading-none">9</span>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary mt-1">Total Patients</span>
            </div>
          </div>

          {/* Total Appointment */}
          <div className="flex items-center justify-start gap-4 rounded-2xl border border-secondary bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary shrink-0">
              <Calendar className="h-8 w-8" />
            </div>
            <div className='flex flex-col items-start text-left'>
              <span className="text-3xl font-extrabold text-primary">9</span>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary mt-1">Total Appointments</span>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="flex items-center justify-start gap-4 rounded-2xl border border-secondary bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-100 shrink-0">
              <Clock className="h-8 w-8  text-amber-600" />
            </div>
            <div className='flex flex-col items-start text-left'>
              <span className="text-3xl font-extrabold text-amber-600">9</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 mt-1">Pending Applications</span>
            </div>
          </div>
        </div>

 {/* Applications summary */}
        <div className="rounded-2xl border border-secondary bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2  px-4 py-1.5 text-md font-bold tracking-wide uppercase text-primary">
              Applications Summary
            </div>
            <Link href="/admin/applications"
            className="flex items-center gap-1 rounded-full bg-primary hover:bg-secondary text-white hover:text-primary px-3.5 py-1 text-xs font-bold transition">
              view all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-1 flex items-center gap-4 rounded-2xl bg-primary text-accent p-5 shadow-md">
              <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold leading-tight">9</span>
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
                  <span className="text-sm font-bold text-amber-700 leading-tight">9</span>
                  <span className="text-xs font-semibold text-amber-900/70 truncate mt-0.5">Pending</span>
                </div>
              </div>

              {/* Approved */}
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3 transition hover:bg-emerald-50">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-emerald-700 leading-tight">9</span>
                  <span className="text-xs font-semibold text-emerald-900/70 truncate mt-0.5">Approved</span>
                </div>
              </div>

              {/* Rejected */}
              <div className="flex items-center gap-3 rounded-xl border border-rose-200/80 bg-rose-50/40 p-3 transition hover:bg-rose-50">
                <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 flex-shrink-0">
                  <XCircle className="h-4 w-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-rose-700 leading-tight">9</span>
                  <span className="text-xs font-semibold text-rose-900/70 truncate mt-0.5">Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  RECENT APPOINTMENTS SECTION  */}
        <div className="rounded-2xl border border-secondary bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 px-4 py-1.5 text-md font-bold tracking-wide uppercase text-primary">
              Recent Appointments
            </div>
             <Link href="/admin/appointments"
              className="flex items-center gap-1 rounded-full bg-primary hover:bg-secondary text-white hover:text-primary px-3.5 py-1 text-xs font-bold transition">
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
              
              {/* Row Placeholders */}
              <div className="space-y-2">
                <div className="h-10 w-full rounded-xl bg-accent/40 border border-secondary/10" />
                <div className="h-10 w-full rounded-xl bg-accent/40 border border-secondary/10" />
                <div className="h-10 w-full rounded-xl bg-accent/40 border border-secondary/10" />
              </div>
            </div>
          </div>
        </div>

        {/* Audit LOGS SECTION  */}
        <div className="rounded-2xl border border-secondary bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <span className="flex items-center gap-2  px-4 py-1.5 text-md font-bold tracking-wide uppercase text-primary inline-flex">
              Audit Logs
            </span>  
            <Link  href="/admin/audit-logs"
            className="flex items-center gap-1 rounded-full bg-primary hover:bg-secondary text-white hover:text-primary px-3.5 py-1 text-xs font-bold transition">
              view all
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Activity Log Placeholder Bars */}
          <div className="space-y-2.5">
            <div className="h-10 w-full rounded-xl bg-accent/40 border border-secondary/10" />
            <div className="h-10 w-full rounded-xl bg-accent/40 border border-secondary/10" />
          </div>
        </div>

      </div>
    </DashboardWrapper>
  );
}