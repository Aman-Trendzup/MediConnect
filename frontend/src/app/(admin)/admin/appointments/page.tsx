'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DashboardWrapper } from '@/components/adminDashboardWrapper';
import { adminApi } from '@/services/adminApi';
import { Search, Loader2, Clock, CheckCircle2, XCircle, CalendarCheck2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Appointment {
  _id: string;
  patientName?: string;
  doctorName?: string;
  dateTime?: string;
  appointmentDate?: string;
  timeSlot?: string;
  type?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  patient?: { name: string; email: string };
  doctor?: { name: string; email: string };
}

interface PaginationMeta {
  totalAppointments: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

function AppointmentMonitoringContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL query parameters
  const currentStatus = searchParams.get('status') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = Number(searchParams.get('page')) || 1;
  const limit = 10;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>(searchQuery);

  // Fetch appointments from backend API 
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params: any = { page: currentPage, limit };
      if (currentStatus && currentStatus !== 'all') params.status = currentStatus;
      if (searchQuery) params.search = searchQuery;

      const data = await adminApi.getAppointments(params);
      if (data.success) {
        setAppointments(data.appointments || data.data || []);
        setPagination(data.pagination || null);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentStatus, searchQuery, currentPage]);

  // Update URL query parameters cleanly (Resets page to 1 on filter/search changes)
  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 when filtering or searching
    if (key !== 'page') {
      params.set('page', '1');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounced search input handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        updateQueryParam('search', searchInput);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="space-y-6">
      
      {/* PAGE TITLE HEADER */}
      <div>
        <div className="inline-flex items-center px-4 py-1 text-sm font-bold tracking-wide uppercase text-primary">
          Monitor Doctor-Patient Appointments
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="p-2">
        
        {/* HEADER & VIEW ALL / COUNT */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="rounded-xl bg-white px-4">
            <h2 className="text-sm font-extrabold text-primary">Recent Appointments</h2>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by patient or doctor name..." 
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-slate-500 shadow-2xs"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Pending', value: 'pending', icon: Clock },
              { label: 'Accepted', value: 'accepted', icon: CalendarCheck2 },
              { label: 'Completed', value: 'completed', icon: CheckCircle2 },
              { label: 'Cancelled', value: 'cancelled', icon: XCircle },
              { label: 'All', value: 'all', icon: null },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentStatus === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => updateQueryParam('status', tab.value)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-white border border-primary' 
                      : 'bg-white text-primary border border-primary hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {tab.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* TABLE CONTAINER */}
        <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              
              {/* Table Column Headers  */}
              <div className="grid grid-cols-5 bg-slate-200/70 rounded-xl p-3 text-xs font-bold text-slate-700 text-center mb-3">
                <span>Patient</span>
                <span>Doctor</span>
                <span>Date & Time</span>
                <span>Type</span>
                <span>Status</span>
              </div>

              {/* Table Rows / Content */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-700" />
                  <p className="text-xs font-semibold">Loading appointments...</p>
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs font-semibold">
                  No appointments found matching your criteria.
                </div>
              ) : (
                <div className="space-y-2">
                  {appointments.map((apt, index) => {
                    const patientName = apt.patientName || apt.patient?.name || 'Patient Name';
                    const doctorName = apt.doctorName || apt.doctor?.name || 'Doctor Name';
                    
                    // Format date & time nicely if available
                    const rawDate = apt.appointmentDate || apt.dateTime;
                    const formattedDate = rawDate 
                      ? new Date(rawDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                      : 'N/A';
                    const timeString = apt.timeSlot ? ` - ${apt.timeSlot}` : '';
                    const dateTimeDisplay = `${formattedDate}${timeString}`;
                    
                    const type = apt.type || 'Consultation';

                    return (
                      <div 
                        key={apt._id || index}
                        className="grid grid-cols-5 items-center h-14 w-full rounded-xl bg-slate-100 border border-slate-200 px-3 text-xs font-medium text-slate-700 text-center"
                      >
                        <span className="font-bold text-slate-900 truncate px-1">{patientName}</span>
                        <span className="truncate px-1">{doctorName}</span>
                        <span className="text-slate-600 truncate px-1">{dateTimeDisplay}</span>
                        <span className="font-semibold truncate px-1">{type}</span>
                        
                        <div>
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            apt.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                            apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            apt.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>

          {/* Table Footer Pagination Controls */}
          {pagination && pagination.totalPages > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 pt-3">
              <div className="text-xs font-semibold text-slate-600">
                Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalAppointments} total records)
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <span className="px-3 py-1 text-xs font-bold text-slate-800 bg-slate-100 rounded-lg border border-slate-200">
                  {currentPage}
                </span>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function AppointmentMonitoringPage() {
  return (
    <DashboardWrapper>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-slate-700" />
          <p className="text-xs font-semibold">Loading appointments...</p>
        </div>
      }>
        <AppointmentMonitoringContent />
      </Suspense>
    </DashboardWrapper>
  );
}