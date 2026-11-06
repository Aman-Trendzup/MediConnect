'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DashboardWrapper } from '@/components/adminDashboardWrapper';
import { adminApi } from '@/services/adminApi'; 
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

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

interface PaginationMeta {
  totalLogs: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Inner component handling state, hooks, and UI markup
function AuditLogsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const limit = 10;

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch audit logs from backend API with pagination parameters
  const fetchAuditLogs = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await adminApi.getAuditLogs({ page: pageNum, limit });
      if (data.success) {
        setLogs(data.logs || []);
        setPagination(data.pagination || null);
      }
    } catch (error: any) {
      console.error("Failed to fetch audit logs:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* PAGE TITLE / HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-xl px-4 py-1 text-md font-bold tracking-wide uppercase text-primary">
          Audit Logs
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
                No audit log records found.
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

        {/* Table Footer Pagination Controls */}
        {pagination && pagination.totalPages > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 pt-3">
            <div className="text-xs font-semibold text-slate-600">
              Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalLogs} total records)
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
  );
}

// Default exported page component that wraps the content in <Suspense>
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