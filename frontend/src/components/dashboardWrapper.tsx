'use client';

import React, { useState, useEffect, ReactNode, Suspense } from 'react';
import { 
  LayoutDashboard, Users, CircleUser, Search, Menu, X, LogOut, 
  HeartHandshake, AppWindow, CalendarDays, BriefcaseBusiness, 
  RotateCcwClock, PanelLeftClose, PanelLeft, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export interface DashboardComponentProps {
  children: ReactNode;
}

/**
 * 1. INNER CONTENT COMPONENT (Contains useSearchParams logic)
 */
function DashboardWrapperContent({ children }: DashboardComponentProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Pull auth user details and logout action from Zustand store
  const { user, logout, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ensure session is verified when dashboard wrapper mounts
  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [user, checkAuth]);

  // Close mobile drawer automatically on screen resize
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

  // Fallback display values if user data is loading or missing
  const displayName = user?.name || 'System Administrator';
  const displayEmail = user?.email || 'admin@mediconnect.com';

  // Helper function to check if a sidebar link is currently active
  const isActiveLink = (path: string, roleQuery?: string) => {
    if (roleQuery) {
      const currentRole = searchParams.get('role');
      return pathname === path && currentRole === roleQuery;
    }
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-secondary text-slate-100 flex flex-col font-sans antialiased">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-primary px-4 backdrop-blur-md sm:px-6 border-b border-white">
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
            className="hidden rounded-lg p-2 text-white hover:text-primary hover:bg-secondary focus:outline-none lg:flex cursor-pointer transition"
            aria-label="Toggle sidebar expand"
          >
            {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          </button>

          {/* Brand/Logo */}
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-white sm:inline-block text-lg tracking-tight">
              MediConnect
            </span>
          </div>
        </div>

        {/* TOP RIGHT CONTROLS */}
        <div className="flex items-center gap-4">
          
          {/* Search Box */}
          <div className="hidden sm:block relative w-56 md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl bg-slate-800/80 border border-slate-700 py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-400 outline-none focus:border-primary transition"
            />
          </div>

          {/* Profile Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 rounded-full p-1.5 transition hover:bg-slate-800 focus:outline-none cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-white font-bold text-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-white truncate max-w-[120px]">
                {displayName}
              </span>
            </button>

            {isProfileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-700 bg-primary py-2 px-2 shadow-2xl ring-1 ring-black/10 z-50"
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                <div className="border-b border-slate-700/80 px-3 py-2.5">
                  <p className="text-xs font-bold text-white truncate">{displayName}</p>
                  <p className="truncate text-[11px] text-slate-400 mt-0.5">{displayEmail}</p>
                </div>
                <div className="pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold rounded-xl text-rose-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex relative min-h-[calc(100vh-4rem)]">
        {/* Mobile Backdrop */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <div
          className={`
            z-40 flex flex-col h-full bg-primary transition-all duration-200 ease-in-out shrink-0 border-b border-white
            lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] 
            ${isMobileOpen ? 'fixed inset-y-16 left-0 translate-x-0 w-64 shadow-2xl' : 'fixed inset-y-16 left-0 -translate-x-full lg:translate-x-0'}
            ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}
          `}
        >
          <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
            
            {/* Dashboard Link */}
            <Link
              href="/admin/dashboard"
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                isActiveLink('/admin/dashboard') 
                  ? 'bg-slate-800 text-white shadow-inner border border-slate-700' 
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
              title={!isSidebarOpen ? 'Dashboard' : undefined}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/dashboard') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                  Dashboard
                </span>
              </div>
            </Link>

            {/* Doctors Link */}
            <Link
              href="/admin/users?role=doctor" 
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                isActiveLink('/admin/users', 'doctor') 
                  ? 'bg-slate-800 text-white shadow-inner border border-slate-700' 
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
              title={!isSidebarOpen ? 'Doctors' : undefined}
            >
              <div className="flex items-center gap-3">
                <HeartHandshake className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/users', 'doctor') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                  Doctors
                </span>
              </div>
            </Link>

            {/* Patients Link */}
            <Link
              href="/admin/users?role=patient" 
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                isActiveLink('/admin/users', 'patient') 
                  ? 'bg-slate-800 text-white shadow-inner border border-slate-700' 
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
              title={!isSidebarOpen ? 'Patients' : undefined}
            >
              <div className="flex items-center gap-3">
                <Users className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/users', 'patient') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                  Patients
                </span>
              </div>
            </Link>
               
            {/* Applications Link */}
            <Link
              href="/admin/applications"
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                isActiveLink('/admin/applications') 
                  ? 'bg-slate-800 text-white shadow-inner border border-slate-700' 
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
              title={!isSidebarOpen ? 'Applications' : undefined}
            >
              <div className="flex items-center gap-3">
                <AppWindow className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/applications') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                  Applications
                </span>
              </div>
            </Link>

            {/* Service Categories Link */}
            <Link
              href="/admin/service-categories"
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                isActiveLink('/admin/service-categories') 
                  ? 'bg-slate-800 text-white shadow-inner border border-slate-700' 
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
              title={!isSidebarOpen ? 'Service Categories' : undefined}
            >
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/service-categories') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                  Service Categories
                </span>
              </div>
            </Link>

            {/* Appointments Link */}
            <Link
              href="/admin/appointments"
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                isActiveLink('/admin/appointments') 
                  ? 'bg-slate-800 text-white shadow-inner border border-slate-700' 
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
              title={!isSidebarOpen ? 'Appointments' : undefined}
            >
              <div className="flex items-center gap-3">
                <CalendarDays className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/appointments') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                  Appointments
                </span>
              </div>
            </Link>
            
            {/* Audit Logs Link */}
            <Link
              href="/admin/audit-logs"
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                isActiveLink('/admin/audit-logs') 
                  ? 'bg-slate-800 text-white shadow-inner border border-slate-700' 
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
              title={!isSidebarOpen ? 'Audit Logs' : undefined}
            >
              <div className="flex items-center gap-3">
                <RotateCcwClock className={`h-4 w-4 shrink-0 ${isActiveLink('/admin/audit-logs') ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                   Audit Logs
                </span>
              </div>
            </Link>

          </nav>
        </div>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-white">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

/**
 * 2. MAIN WRAPPER WITH SUSPENSE BOUNDARY
 */
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