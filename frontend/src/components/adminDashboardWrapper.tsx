'use client';

import React, { useState, useEffect, ReactNode, Suspense } from 'react';
import { 
  LayoutDashboard, Users, CircleUser, Search, Menu, X, LogOut, 
  HeartHandshake, AppWindow, CalendarDays, BriefcaseBusiness, 
  RotateCcwClock, PanelLeftClose, PanelLeft, Loader2 ,HeartPulse
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export interface DashboardComponentProps {
  children: ReactNode;
}

function DashboardWrapperContent({ children }: DashboardComponentProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Pull auth user details and logout action from Zustand store
  const { user, logout, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [user, checkAuth]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const displayName = user?.name || 'Name';
  const displayEmail = user?.email || 'Email';

  const isActiveLink = (path: string, roleQuery?: string) => {
    if (roleQuery) {
      const currentRole = searchParams.get('role');
      return pathname === path && currentRole === roleQuery;
    }
    return pathname === path;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-100 font-sans antialiased">

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          z-40 flex flex-col h-screen bg-primary transition-all duration-300 ease-in-out shrink-0 border-r border-slate-700/80 fixed inset-y-0 left-0
          ${isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}
        `}
      >
        {/* Brand/Logo Header */}
        <Link href="/"
        className="flex h-16 items-center gap-3 px-4 border-b border-slate-700/80 shrink-0">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-[#16587b] shadow-md transition-transform duration-300 group-hover:scale-105">
              <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6 text-[#84b3ce]" />
            </div>
          <span className={`font-bold text-white text-lg tracking-tight truncate ${!isSidebarOpen && 'lg:hidden'}`}>
            MediConnect
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
          
          {/* Dashboard Link */}
          <Link
            href="/admin/dashboard"
            className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition ${
              isActiveLink('/admin/dashboard') 
                ? 'bg-[#eff6ff] text-primary shadow-inner border border-slate-700' 
                : 'text-white hover:bg-slate-800 hover:text-secondary'
            }`}
            title={!isSidebarOpen ? 'Dashboard' : undefined}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/dashboard') ? 'text-primary' : 'text-slate-400 group-hover:text-secondary'}`} />
              <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                Dashboard
              </span>
            </div>
          </Link>

          {/* Doctors Link */}
          <Link
            href="/admin/users?role=doctor" 
            className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition ${
              isActiveLink('/admin/users', 'doctor') 
                 ? 'bg-[#eff6ff] text-primary shadow-inner border border-slate-700' 
                  : 'text-white hover:bg-slate-800 hover:text-secondary'
            }`}
            title={!isSidebarOpen ? 'Doctors' : undefined}
          >
            <div className="flex items-center gap-3">
              <HeartHandshake className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/users', 'doctor') ? 'text-primary' : 'text-slate-400 group-hover:text-secondary'}`} />
              <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                Doctors
              </span>
            </div>
          </Link>

          {/* Patients Link */}
          <Link
            href="/admin/users?role=patient" 
            className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition ${
              isActiveLink('/admin/users', 'patient') 
                ? 'bg-[#eff6ff] text-primary shadow-inner border border-slate-700' 
                : 'text-white hover:bg-slate-800 hover:text-secondary'
            }`}
            title={!isSidebarOpen ? 'Patients' : undefined}
          >
            <div className="flex items-center gap-3">
              <Users className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/users', 'patient') ? 'text-primary' : 'text-slate-400 group-hover:text-secondary'}`} />
              <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                Patients
              </span>
            </div>
          </Link>
             
          {/* Applications Link */}
          <Link
            href="/admin/applications"
            className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition ${
              isActiveLink('/admin/applications') 
              ? 'bg-[#eff6ff] text-primary shadow-inner border border-slate-700' 
                : 'text-white hover:bg-slate-800 hover:text-secondary'
            }`}
            title={!isSidebarOpen ? 'Applications' : undefined}
          >
            <div className="flex items-center gap-3">
              <AppWindow className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/applications') ? 'text-primary' : 'text-slate-400 group-hover:text-secondary'}`} />
              <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                Applications
              </span>
            </div>
          </Link>

          {/* Service Categories Link */}
          <Link
            href="/admin/service-categories"
            className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition ${
              isActiveLink('/admin/service-categories') 
                ? 'bg-[#eff6ff] text-primary shadow-inner border border-slate-700' 
                : 'text-white hover:bg-slate-800 hover:text-secondary'
            }`}
            title={!isSidebarOpen ? 'Service Categories' : undefined}
          >
            <div className="flex items-center gap-3">
              <BriefcaseBusiness className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/service-categories') ? 'text-primary' : 'text-slate-400 group-hover:text-secondary'}`} />
              <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                Service Categories
              </span>
            </div>
          </Link>

          {/* Appointments Link */}
          <Link
            href="/admin/appointments"
            className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition ${
              isActiveLink('/admin/appointments') 
                 ? 'bg-[#eff6ff] text-primary shadow-inner border border-slate-700' 
                 : 'text-white hover:bg-slate-800 hover:text-secondary'
            }`}
            title={!isSidebarOpen ? 'Appointments' : undefined}
          >
            <div className="flex items-center gap-3">
              <CalendarDays className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/appointments') ? 'text-primary' : 'text-slate-400 group-hover:text-secondary'}`} />
              <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                Appointments
              </span>
            </div>
          </Link>
          
          {/* Audit Logs Link */}
          <Link
            href="/admin/audit-logs"
            className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition ${
              isActiveLink('/admin/audit-logs') 
                 ? 'bg-[#eff6ff] text-primary shadow-inner border border-slate-700' 
                 : 'text-white hover:bg-slate-800 hover:text-secondary'
            }`}
            title={!isSidebarOpen ? 'Audit Logs' : undefined}
          >
            <div className="flex items-center gap-3">
              <RotateCcwClock className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/audit-logs') ? 'text-primary' : 'text-slate-400 group-hover:text-secondary'}`} />
              <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                 Audit Logs
              </span>
            </div>
          </Link>

        </nav>
      </aside>

      {/* RIGHT SIDE CONTAINER */}
      <div 
        className={`flex h-screen min-w-0 flex-1 flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}
      >

        {/* NAVBAR */}
        <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between bg-primary px-4 backdrop-blur-md sm:px-6 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 focus:outline-none lg:hidden cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Desktop Sidebar Collapse Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden rounded-lg p-2 text-white hover:text-slate-300 focus:outline-none lg:flex cursor-pointer transition"
              aria-label="Toggle sidebar expand"
            >
              {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            </button>
          </div>

          {/* TOP RIGHT CONTROLS */}
          <div className="flex items-center gap-4">
            {/* Profile Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-800/60 focus:outline-none"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe] text-sm font-semibold text-[#2563eb]">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              </button>

              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 rounded-lg border border-slate-700 bg-white py-1 px-1 shadow-2xl ring-1 ring-black/10 z-50"
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <div className="border-b border-slate-700/80 px-3 py-2.5">
                    <p className="text-xs font-bold text-slate-800">{displayName}</p>
                    <p className="text-xs text-[#64748b]">{displayEmail}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#dc2626] transition hover:bg-red-500 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

    </div>
  );
}

// MAIN WRAPPER WITH SUSPENSE BOUNDARY
export function DashboardWrapper({ children }: DashboardComponentProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
          <div className="flex items-center gap-3 text-slate-300 font-medium text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>Loading Dashboard...</span>
          </div>
        </div>
      }
    >
      <DashboardWrapperContent>{children}</DashboardWrapperContent>
    </Suspense>
  );
}