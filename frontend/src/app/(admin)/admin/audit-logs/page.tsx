import React from 'react';
import { DashboardWrapper } from '@/components/dashboardWrapper';
import { Activity, Search, Filter, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';

export default function AuditLogsPage() {
  return (
    <DashboardWrapper>
      <div className="space-y-6 text-secondary">
        
        {/* PAGE TITLE / HEADER  */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-md font-bold tracking-wide uppercase text-primary">
            <Activity className="h-4 w-4 text-primary" />
             Audit Logs
          </div>
        </div>

        {/* SEARCH & FILTER BAR  */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-white p-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <input 
              type="text" 
              placeholder="Search logs" 
              className="w-full rounded-xl border border-primary py-2 pl-9 pr-4 text-xs text-primary outline-none focus:border-primary"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button className="flex items-center gap-1.5 rounded-xl border border-primary px-4 py-2 text-xs font-bold text-primary hover:bg-secondary/10 transition">
              <Filter className="h-3.5 w-3.5 text-primary" />
              Filter Logs
            </button>
            <button className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90 transition">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        </div>

        {/*  ACTIVITY LOGS TABLE  */}
        <div className="rounded-2xl border border-primary bg-white p-6 shadow-sm">
          
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              
              {/* Table Column Headers */}
              <div className="grid grid-cols-6 bg-secondary/5 rounded-xl p-3 text-xs font-bold text-primary text-center mb-3">
                <span>Timestamp</span>
                <span>Actor</span>
                <span>Role</span>
                <span>Affected Resource</span>
                <span>Result</span>
                <span>Details</span>
              </div>
              
              {/* Alternating Row Stripe Wireframe Placeholders */}
              <div className="space-y-2">
                <div className="grid grid-cols-6 items-center h-10 w-full rounded-xl bg-primary/20 border border-primary/10 px-3">
                  <div className="h-3 w-20 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-16 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-12 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-24 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-14 rounded bg-emerald-600/30 mx-auto" />
                  <div className="h-3 w-16 rounded bg-secondary/20 mx-auto" />
                </div>

                <div className="grid grid-cols-6 items-center h-10 w-full rounded-xl bg-accent/40 border border-secondary/10 px-3">
                  <div className="h-3 w-20 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-16 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-12 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-24 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-14 rounded bg-rose-600/30 mx-auto" />
                  <div className="h-3 w-16 rounded bg-secondary/20 mx-auto" />
                </div>

                <div className="grid grid-cols-6 items-center h-10 w-full rounded-xl bg-primary/20 border border-primary/10 px-3">
                  <div className="h-3 w-20 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-16 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-12 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-24 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-14 rounded bg-emerald-600/30 mx-auto" />
                  <div className="h-3 w-16 rounded bg-secondary/20 mx-auto" />
                </div>

                <div className="grid grid-cols-6 items-center h-10 w-full rounded-xl bg-accent/40 border border-secondary/10 px-3">
                  <div className="h-3 w-20 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-16 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-12 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-24 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-14 rounded bg-emerald-600/30 mx-auto" />
                  <div className="h-3 w-16 rounded bg-secondary/20 mx-auto" />
                </div>

                <div className="grid grid-cols-6 items-center h-10 w-full rounded-xl bg-primary/20 border border-primary/10 px-3">
                  <div className="h-3 w-20 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-16 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-12 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-24 rounded bg-secondary/20 mx-auto" />
                  <div className="h-3 w-14 rounded bg-amber-600/30 mx-auto" />
                  <div className="h-3 w-16 rounded bg-secondary/20 mx-auto" />
                </div>
              </div>

            </div>
          </div>

          {/* Table Footer Pagination Info */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-secondary/10 pt-4">
            <div className="rounded-xl border border-secondary/15 bg-accent px-4 py-2 text-xs font-semibold text-secondary shadow-2xs">
              Showing 1-10 of 1,240 events
            </div>

            <div className="flex items-center gap-1">
              <button disabled className="flex h-8 w-8 items-center justify-center rounded-lg border border-secondary/20 bg-accent text-secondary/40 cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary bg-primary text-accent text-xs font-bold">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-secondary/20 bg-accent text-secondary text-xs font-medium hover:bg-secondary/10 transition">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-secondary/20 bg-accent text-secondary text-xs font-medium hover:bg-secondary/10 transition">
                3
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-secondary/20 bg-accent text-secondary hover:bg-secondary/10 transition">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </DashboardWrapper>
  );
}