'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DashboardWrapper } from '@/components/dashboardWrapper';
import { adminApi } from '@/services/adminApi'; 
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface AuditLog {
  _id: string;
  createdAt: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    role?: string;
  };
  role?: string;
  action?: string;
  targetModel?: string;
  target?: string;
  success?: boolean;
  details?: string;
}

// 1. Inner component handling all state, hooks, and UI markup
function AuditLogsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('search') || '';

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>(searchQuery);

  // Fetch audit logs from backend API using Axios
  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (searchQuery) params.search = searchQuery;

        const data = await adminApi.getAuditLogs(params);
        if (data.success) {
          setLogs(data.logs || data.data || []);
        }
      } catch (error: any) {
        console.error("Failed to fetch audit logs:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [searchQuery]);

  // Update URL query parameters cleanly
  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
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
    <div className="space-y-6 text-slate-800">
      
      {/* PAGE TITLE / HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-md font-bold tracking-wide uppercase text-primary">
          Audit Logs
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search logs by actor or action..." 
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-slate-500 shadow-2xs"
          />
        </div>
      </div>

      {/* STREAMLINED TABLE CONTAINER */}
      <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
        
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            
            {/* Table Column Headers with Compact Widths & Maximum Action Space */}
            <div className="grid grid-cols-[120px_110px_70px_110px_80px_1fr] bg-slate-200/70 rounded-xl p-2.5 text-xs font-bold text-slate-700 text-center mb-2 gap-2">
              <span>Timestamp</span>
              <span>Actor</span>
              <span>Role</span>
              <span>Resource</span>
              <span>Result</span>
              <span className="text-left pl-3">Action Details</span>
            </div>
            
            {/* Table Rows */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-slate-700" />
                <p className="text-xs font-semibold">Loading audit logs...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs font-semibold">
                No audit log records found matching your search.
              </div>
            ) : (
              <div className="space-y-1.5">
                {logs.map((log, index) => {
                  const timestamp = log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A';
                  const actor = log.user?.name || 'System Admin';
                  const role = log.user?.role || log.role || 'Admin';
                  const resource = log.targetModel || 'Service';
                  const isSuccess = log.success !== false;
                  const actionText = log.action || log.details || 'Action completed';

                  return (
                    <div 
                      key={log._id || index}
                      className="grid grid-cols-[120px_110px_70px_110px_80px_1fr] items-center min-h-[44px] py-2 w-full rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs font-medium text-slate-700 text-center gap-2"
                    >
                      <span className="text-slate-600 truncate text-[11px]">{timestamp}</span>
                      <span className="font-bold text-slate-900 truncate">{actor}</span>
                      <span className="uppercase text-[10px] font-bold text-slate-600 truncate">{role}</span>
                      <span className="truncate">{resource}</span>
                      <div className="flex justify-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isSuccess ? 'Success' : 'Failed'}
                        </span>
                      </div>
                      <span className="text-left text-slate-800 font-semibold pl-3 break-words whitespace-normal leading-snug">
                        {actionText}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* Table Footer Pagination Info */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 pt-3">
          <div className="text-xs font-semibold text-slate-600">
            Showing total {logs.length} logged events
          </div>

          <div className="flex items-center gap-1">
            <button disabled className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-400 cursor-not-allowed">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-800 text-white text-xs font-bold">
              1
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition">
              2
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition">
              3
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

// 2. Default exported page component that wraps the content in <Suspense>
export default function AuditLogsPage() {
  return (
    <DashboardWrapper>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-slate-700" />
          <p className="text-xs font-semibold">Loading audit logs...</p>
        </div>
      }>
        <AuditLogsContent />
      </Suspense>
    </DashboardWrapper>
  );
}