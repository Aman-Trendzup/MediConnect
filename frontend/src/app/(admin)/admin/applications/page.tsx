'use client';

import React, { useState, useEffect,Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DashboardWrapper } from '@/components/dashboardWrapper';
import { adminApi } from '@/services/adminApi'; // 👈 Import your Axios API layer
import { Eye, Search, Loader2, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

interface Application {
  _id: string;
  fullName?: string;
  speciality?: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_correction';
  submittedAt: string;
  consultationFee?: number;
  experienceYears?: number;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  clinicAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export default function DoctorApplicationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current query params from URL (default to 'pending' if none provided)
  const currentStatus = searchParams.get('status') || 'pending';
  const searchQuery = searchParams.get('search') || '';

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>(searchQuery);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Fetch applications whenever URL query parameters change using Axios
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (currentStatus && currentStatus !== 'all') params.status = currentStatus;
      if (searchQuery) params.search = searchQuery;

      // Uses your adminApi service layer
      const data = await adminApi.getDoctorApplications(params);
      
      if (data.success) {
        // Matches your backend JSON response structure: { success: true, count: X, applications: [...] }
        setApplications(data.applications || data.data || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch doctor applications:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [currentStatus, searchQuery]);

  // Helper to update URL query parameters cleanly
  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle search submission / typing with debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        updateQueryParam('search', searchInput);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle Review / Status Update (Approve, Reject, or Needs Correction)
  const handleReviewAction = async (id: string, newStatus: 'approved' | 'rejected' | 'needs_correction', doctorName: string) => {
    let comment = '';
    if (newStatus === 'needs_correction' || newStatus === 'rejected') {
      const input = prompt(`Enter reason for ${newStatus === 'rejected' ? 'rejection' : 'correction'} for ${doctorName}:`);
      if (input === null) return; // Cancelled
      comment = input;
    } else {
      if (!confirm(`Are you sure you want to approve application for "${doctorName}"?`)) return;
    }

    setActionLoadingId(id);
    try {
      // Calls your backend patch review route via adminApi
      const data = await adminApi.reviewDoctorApplication(id, { 
        status: newStatus, 
        comment: comment || `Application status updated to ${newStatus}` 
      });

      if (data.success) {
        fetchApplications(); // Refresh list
      } else {
        alert(data.message || 'Failed to update application status');
      }
    } catch (error: any) {
      console.error("Error reviewing application:", error);
      alert(error.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <DashboardWrapper>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-slate-700" />
          <p className="text-xs font-semibold">Loading applications...</p>
        </div>
      }>
      <div className="space-y-6 text-slate-800">
        
        {/* MAIN CONTAINER */}
        <div className="rounded-2xl border border-slate-300 bg-slate-100 p-6 shadow-sm">
          
          {/* TOP HEADER & COUNTER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200">
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Doctor Applications</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage and review incoming doctor registration applications</p>
            </div>

            {/* Total Count Badge */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs">
              <span>{applications.length} Applications Found</span>
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
                placeholder="Search by doctor name or email..." 
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-slate-500 shadow-2xs"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'Pending', value: 'pending', icon: Clock },
                { label: 'Needs Correction', value: 'needs_correction', icon: AlertCircle },
                { label: 'Approved', value: 'approved', icon: CheckCircle2 },
                { label: 'Rejected', value: 'rejected', icon: XCircle },
                { label: 'All', value: 'all', icon: null },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = currentStatus === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => updateQueryParam('status', tab.value)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-2xs ${
                      isActive 
                        ? 'bg-slate-800 text-white border border-slate-800' 
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {tab.label}
                  </button>
                );
              })}
            </div>

          </div>

          {/* REQUESTS GRID */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-slate-700" />
              <p className="text-xs font-semibold">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2 border border-dashed border-slate-300 rounded-2xl bg-white">
              <p className="text-sm font-bold text-slate-800">No applications found</p>
              <p className="text-xs text-slate-400">There are no applications matching the selected status or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {applications.map((app) => {
                const doctorName = app.fullName || app.user?.name || 'Doctor Name';
                const doctorEmail = app.user?.email || 'No email provided';
                const initial = doctorName.charAt(0).toUpperCase();
                const formattedDate = app.submittedAt 
                  ? new Date(app.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'Recent';
                const isActionLoading = actionLoadingId === app._id;

                return (
                  <div 
                    key={app._id} 
                    className="flex flex-col justify-between rounded-2xl border border-slate-300 bg-white p-5 shadow-2xs transition hover:border-slate-400"
                  >
                    <div>
                      {/* Doctor Basic Profile Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3.5 overflow-hidden">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-800 font-bold text-base flex-shrink-0 shadow-2xs">
                            {initial}
                          </div>
                          <div className="truncate">
                            <h3 className="text-sm font-bold text-slate-900 truncate">{doctorName}</h3>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{doctorEmail}</p>
                            <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                              <span>Submitted: {formattedDate}</span>
                              {app.experienceYears && <span>• {app.experienceYears} yrs exp</span>}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex-shrink-0 ${
                          app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          app.status === 'needs_correction' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Clinic Location / Fee Summary if available */}
                      {app.clinicAddress && (
                        <div className="mb-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600 space-y-1">
                          <p><strong className="text-slate-700">Location:</strong> {app.clinicAddress.city}, {app.clinicAddress.state}</p>
                          {app.consultationFee && <p><strong className="text-slate-700">Fee:</strong> ₹{app.consultationFee}</p>}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                      <button 
                        onClick={() => router.push(`/admin/applications/${app._id}`)}
                        title="View Full Application Details"
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-800 hover:text-white transition shadow-2xs cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>

                      <button 
                        onClick={() => handleReviewAction(app._id, 'approved', doctorName)}
                        disabled={isActionLoading || app.status === 'approved'}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
                      >
                        {isActionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Approve
                      </button>

                      <button 
                        onClick={() => handleReviewAction(app._id, 'rejected', doctorName)}
                        disabled={isActionLoading || app.status === 'rejected'}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50 cursor-pointer"
                      >
                        {isActionLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Reject
                      </button>
                    </div>

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