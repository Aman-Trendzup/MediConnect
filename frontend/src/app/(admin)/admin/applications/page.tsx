'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DashboardWrapper } from '@/components/dashboardWrapper';
import { Eye, Search, Loader2, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

interface Application {
  _id: string;
  fullName: string;
  speciality: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_correction';
  submittedAt: string;
  user?: {
    name: string;
    email: string;
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

  // Fetch applications whenever URL query parameters change
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (currentStatus) queryParams.append('status', currentStatus);
        if (searchQuery) queryParams.append('search', searchQuery);
      } catch (error) {
        console.error("Failed to fetch doctor applications:", error);
      } finally {
        setLoading(false);
      }
    };

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

  return (
    <DashboardWrapper>
      <div className="space-y-6 text-secondary">
        
        {/* MAIN CONTAINER */}
        <div className="rounded-2xl bg-white p-6 ">
          
          {/* TOP HEADER & COUNTER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6  pb-5">
            <div>
              <h1 className="text-lg font-extrabold text-primary">Doctor Applications</h1>
              <p className="text-xs text-secondary mt-0.5">Manage and review doctors applications</p>
            </div>

            {/* Total Count Badge */}
            <div className="flex items-center gap-2 rounded-xl border border-secondary/15 bg-accent/50 px-4 py-2 text-xs font-bold text-secondary">
              <span>{applications.length} Applications Found</span>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" />
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by doctor name or email..." 
                className="w-full rounded-xl border border-secondary/20 bg-accent/40 py-2.5 pl-10 pr-4 text-xs font-medium text-secondary placeholder-secondary/40 outline-none focus:border-primary shadow-2xs"
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
                        ? 'bg-primary text-white border border-primary' 
                        : 'bg-accent/50 text-secondary border border-secondary/15 hover:bg-accent'
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
            <div className="flex flex-col items-center justify-center py-20 text-secondary/60 gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <p className="text-xs font-semibold">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-secondary/60 gap-2 border border-dashed border-secondary/20 rounded-2xl">
              <p className="text-sm font-bold text-secondary">No applications found</p>
              <p className="text-xs">There are no applications matching the selected status or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {applications.map((app) => {
                const initial = (app.fullName || app.user?.name || 'D').charAt(0).toUpperCase();
                const formattedDate = app.submittedAt 
                  ? new Date(app.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'Recent';

                return (
                  <div 
                    key={app._id} 
                    className="flex flex-col justify-between rounded-2xl border border-secondary/20 bg-white p-5 shadow-2xs transition hover:border-primary"
                  >
                    <div>
                      {/* Doctor Basic Profile Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-base flex-shrink-0 shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-primary">{app.fullName || app.user?.name}</h3>
                            <p className="text-xs font-medium text-secondary/70 flex items-center gap-1 mt-0.5">
                              {app.speciality || 'General Specialist'} • {formattedDate}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          app.status === 'needs_correction' ? 'bg-orange-100 text-orange-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex items-center gap-2 pt-3 border-t border-secondary/10">
                      <button 
                        onClick={() => router.push(`/admin/applications/${app._id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-primary bg-white py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition shadow-2xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90 transition">
                        Approve
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90 transition">
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
    </DashboardWrapper>
  );
}