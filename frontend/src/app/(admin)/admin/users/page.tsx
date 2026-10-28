'use client';

import React, { useState,useEffect } from 'react';
import { DashboardWrapper } from '@/components/dashboardWrapper';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface UserManagementPageProps {
  type?: 'doctors' | 'patients';
}

export default function UserManagementPage({ type = 'doctors' }: UserManagementPageProps) {
 const searchParams = useSearchParams();
  
  // Read role from URL query (?role=doctor or ?role=patient). Defaults to 'doctor' if not specified.
  const roleQuery = searchParams.get('role') || 'doctor';
  const isDoctor = roleQuery === 'doctor';

  // Your existing useEffect can now use roleQuery directly to fetch the correct data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/admin/users?role=${roleQuery}`, {
          credentials: 'include'
        });
        const data = await response.json();
        // setUsers(data.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, [roleQuery]);

  
  const title = isDoctor ? 'View and Manage registered Doctors' : 'View and Manage registered Patients';
  const subtitle = isDoctor 
    ? 'Search and manage 1,000 registered Doctors accounts.' 
    : 'Search and manage 2,500 registered Patients accounts.';
  const newThisMonthLabel = isDoctor ? 'New Doctors this month' : 'New Patients this month';
  const activeLabel = isDoctor ? 'Active Doctors' : 'Active Patients';
  const pendingLabel = isDoctor ? 'Pending Requests' : 'Inactive / Blocked';
  const searchPlaceholder = isDoctor 
    ? 'Search by Doctor ID, name or email, speciality..' 
    : 'Search by Patient ID, name or email..';
  const totalCountLabel = isDoctor ? '1,000 Doctors' : '2,500 Patients';

  return (
    <DashboardWrapper>
      <div className="space-y-6 text-secondary">
        
        {/*  PAGE TITLE / HEADER  */}
        <div>
          <div className="inline-flex items-center gap-2  px-4 py-1.5 text-md font-bold tracking-wide uppercase text-primary">
            {title}
          </div>
        </div>

        {/*  STATS OVERVIEW CARDS  */}
        <div className="rounded-2xl border border-primary/20 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary/60">{subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 2: Active */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-emerald-900 uppercase">{activeLabel}</span>
              </div>
              <span className="text-xl font-extrabold text-emerald-700">920</span>
            </div>

            {/* Card 3: Pending / Inactive */}
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-amber-900 uppercase">{pendingLabel}</span>
              </div>
              <span className="text-xl font-extrabold text-amber-600">80</span>
            </div>
          </div>
        </div>

        {/*  DATA TABLE CONTAINER  */}
        <div className="rounded-2xl border border-primary bg-white p-6 shadow-sm">
          
          {/* SEARCH BAR & COUNTER */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <input 
                type="text" 
                placeholder={searchPlaceholder} 
                className="w-full rounded-xl border border-secondary py-2.5 pl-10 pr-4 text-xs font-medium text-primary placeholder-secondary/40 outline-none focus:border-primary shadow-2xs"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-secondary px-4 py-1.5 text-xs font-bold text-secondary">
                {totalCountLabel}
              </span>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <div className="min-w-[850px]">
              
              {/* Table Column Headers */}
              <div className={`grid ${isDoctor ? 'grid-cols-7' : 'grid-cols-6'} bg-secondary/5 rounded-xl p-3 text-xs font-bold text-secondary/70 text-center mb-3`}>
                <span>{isDoctor ? 'Doctor ID' : 'Patient ID'}</span>
                <span>{isDoctor ? 'Doctor Name' : 'Patient Name'}</span>
                <span>Email Id</span>
                <span>Registration Date</span>
                {isDoctor && <span>Speciality</span>}
                <span>Account Status</span>
                <span>Action</span>
              </div>
              
              {/* Table Rows */}
              <div className="space-y-2">
                
                {/* Row 1 */}
                <div className={`grid ${isDoctor ? 'grid-cols-7' : 'grid-cols-6'} items-center h-12 w-full rounded-xl bg-primary/20 border border-primary/10 px-3 text-xs font-medium text-secondary text-center`}>
                  <span className="font-bold text-primary">#DOC-9021</span>
                  <span>Aarya Singh</span>
                  <span className="text-secondary/70 truncate px-1">aarya.s@example.com</span>
                  <span>18 Mar, 2026</span>
                  {isDoctor && <span className="font-semibold">Cardiology</span>}
                  <span>
                    <span className="rounded-full bg-emerald-600/20 text-emerald-700 px-2.5 py-1 font-bold text-[10px]">Active</span>
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1.5 rounded-lg bg-white shadow-2xs hover:bg-primary hover:text-accent transition">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-white shadow-2xs hover:bg-rose-600 hover:text-white transition">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Row 2 */}
                <div className={`grid ${isDoctor ? 'grid-cols-7' : 'grid-cols-6'} items-center h-12 w-full rounded-xl bg-accent/40 border border-secondary/10 px-3 text-xs font-medium text-secondary text-center`}>
                  <span className="font-bold text-primary">#DOC-9022</span>
                  <span>Rahul Sharma</span>
                  <span className="text-secondary/70 truncate px-1">rahul.sharma@example.com</span>
                  <span>19 Mar, 2026</span>
                  {isDoctor && <span className="font-semibold">Neurology</span>}
                  <span>
                    <span className="rounded-full bg-emerald-600/20 text-emerald-700 px-2.5 py-1 font-bold text-[10px]">Active</span>
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1.5 rounded-lg bg-white shadow-2xs hover:bg-primary hover:text-accent transition">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-white shadow-2xs hover:bg-rose-600 hover:text-white transition">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Row 3 */}
                <div className={`grid ${isDoctor ? 'grid-cols-7' : 'grid-cols-6'} items-center h-12 w-full rounded-xl bg-primary/20 border border-primary/10 px-3 text-xs font-medium text-secondary text-center`}>
                  <span className="font-bold text-primary">#DOC-9023</span>
                  <span>Priya Patel</span>
                  <span className="text-secondary/70 truncate px-1">priya.p@example.com</span>
                  <span>20 Mar, 2026</span>
                  {isDoctor && <span className="font-semibold">Pediatrics</span>}
                  <span>
                    <span className="rounded-full bg-amber-500/20 text-amber-700 px-2.5 py-1 font-bold text-[10px]">Pending</span>
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1.5 rounded-lg bg-white shadow-2xs hover:bg-primary hover:text-accent transition">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-white shadow-2xs hover:bg-rose-600 hover:text-white transition">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* TABLE FOOTER / PAGINATION */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-secondary/10 pt-4">
            <div className="rounded-xl border border-secondary bg-white px-4 py-2 text-xs font-semibold text-secondary shadow-2xs">
              Showing 1-10 of 1,000 {isDoctor ? 'Doctor' : 'Patient'}
            </div>

            <div className="flex items-center gap-1">
              <button disabled className="flex h-8 w-8 items-center justify-center rounded-lg border border-secondary  text-secondary cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary bg-primary text-white text-xs font-bold">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-secondary bg-white text-secondary text-xs font-medium hover:bg-secondary/10 transition">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-secondary bg-white text-secondary text-xs font-medium hover:bg-secondary/10 transition">
                3
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-secondary bg-white text-secondary hover:bg-secondary/10 transition">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </DashboardWrapper>
  );
}