import React from 'react';
import { DashboardWrapper } from '@/components/dashboardWrapper';
import { 
  Search, 
  Plus, 
  Stethoscope, 
  HeartPulse, 
  Brain, 
  Bone, 
  Baby, 
  Activity, 
  ChevronRight 
} from 'lucide-react';

export default function ServiceCategoriesPage() {
  return (
    <DashboardWrapper>
      <div className="space-y-6 text-secondary">
        
        {/*  PAGE TITLE / HEADER */}
        <div>
          <div className="inline-flex items-center gap-2  px-4 py-1.5 text-md font-bold tracking-wide uppercase text-primary ">
            View and Manage Medical Services Categories
          </div>
        </div>

        {/* MAIN CONTAINER */}
        <div className="rounded-2xl border border-primary/20 bg-secondary/5 p-6 shadow-sm">
          
          {/* SEARCH & ADD CATEGORY BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary/40" />
              <input 
                type="text" 
                placeholder="Search by Category Name..." 
                className="w-full rounded-xl border border-secondary/20 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-secondary placeholder-secondary/40 outline-none focus:border-primary shadow-2xs"
              />
            </div>
            
            <button className="flex items-center gap-2 w-full sm:w-auto justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-accent shadow-sm hover:opacity-90 transition">
              <Plus className="h-4 w-4" />
              Add Category
            </button>
          </div>

          {/* CATEGORIES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Card 1: Cardiology */}
            <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-white p-4 shadow-sm transition hover:border-primary group cursor-pointer">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base flex-shrink-0">
                  C
                </div>
                <div>
                  <h3 className="text-sm font-bold text-secondary">Cardiology</h3>
                  <p className="text-xs font-medium text-secondary/60 mt-0.5">34 Doctors</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-secondary/30 group-hover:text-primary transition" />
            </div>

            {/* Card 2: Neurology */}
            <div className="flex items-center justify-between rounded-2xl border border-secondary/15 bg-white p-4 shadow-sm transition hover:border-primary group cursor-pointer">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/5 text-secondary font-bold text-base flex-shrink-0">
                  N
                </div>
                <div>
                  <h3 className="text-sm font-bold text-secondary">Neurology</h3>
                  <p className="text-xs font-medium text-secondary/60 mt-0.5">18 Doctors</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-secondary/30 group-hover:text-primary transition" />
            </div>

            {/* Card 3: Orthopedics */}
            <div className="flex items-center justify-between rounded-2xl border border-secondary/15 bg-white p-4 shadow-sm transition hover:border-primary group cursor-pointer">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/5 text-secondary font-bold text-base flex-shrink-0">
                  O
                </div>
                <div>
                  <h3 className="text-sm font-bold text-secondary">Orthopedics</h3>
                  <p className="text-xs font-medium text-secondary/60 mt-0.5">24 Doctors</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-secondary/30 group-hover:text-primary transition" />
            </div>

            {/* Card 4: Pediatrics */}
            <div className="flex items-center justify-between rounded-2xl border border-secondary/15 bg-white p-4 shadow-sm transition hover:border-primary group cursor-pointer">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/5 text-secondary font-bold text-base flex-shrink-0">
                  P
                </div>
                <div>
                  <h3 className="text-sm font-bold text-secondary">Pediatrics</h3>
                  <p className="text-xs font-medium text-secondary/60 mt-0.5">29 Doctors</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-secondary/30 group-hover:text-primary transition" />
            </div>

            {/* Card 5: Dermatology */}
            <div className="flex items-center justify-between rounded-2xl border border-secondary/15 bg-white p-4 shadow-sm transition hover:border-primary group cursor-pointer">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/5 text-secondary font-bold text-base flex-shrink-0">
                  D
                </div>
                <div>
                  <h3 className="text-sm font-bold text-secondary">Dermatology</h3>
                  <p className="text-xs font-medium text-secondary/60 mt-0.5">15 Doctors</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-secondary/30 group-hover:text-primary transition" />
            </div>

            {/* Card 6: General Medicine */}
            <div className="flex items-center justify-between rounded-2xl border border-secondary/15 bg-white p-4 shadow-sm transition hover:border-primary group cursor-pointer">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/5 text-secondary font-bold text-base flex-shrink-0">
                  G
                </div>
                <div>
                  <h3 className="text-sm font-bold text-secondary">General Medicine</h3>
                  <p className="text-xs font-medium text-secondary/60 mt-0.5">42 Doctors</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-secondary/30 group-hover:text-primary transition" />
            </div>

          </div>

        </div>

      </div>
    </DashboardWrapper>
  );
}