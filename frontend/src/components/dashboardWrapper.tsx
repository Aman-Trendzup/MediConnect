'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { LayoutDashboard, BarChart3, Users, CircleUser, Settings, Search, Menu, X, LogOut, User as UserIcon, HelpCircle, PanelLeftClose, PanelLeft, HeartHandshake, AppWindow, CalendarDays, BriefcaseBusiness, RotateCcwClock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export interface DashboardComponentProps {
  children: ReactNode;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export const DashboardWrapper: React.FC<DashboardComponentProps> = ({
  children,
  user = {
    name: 'Admin',
    email: 'admin@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
  },
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Close mobile drawer automatically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-secondary text-slate-100 flex flex-col font-sans antialiased">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-primary px-4 backdrop-blur-md sm:px-6 border-b border-white">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 focus:outline-none lg:hidden"
            aria-label="Toggle mobile menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden rounded-lg p-2 text-white hover:text-secondary focus:outline-none lg:flex"
            aria-label="Toggle sidebar expand"
          >
            {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          </button>

          {/* Brand/Logo */}
          <div className="flex items-center gap-2.5">
            <span className="hidden font-semibold text-white sm:inline-block text-lg">
              MediConnect
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="hidden max-w-md flex-1 px-8 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search users, metrics, logs..."
              className="w-full rounded-lg bg-white py-1.5 pl-10 pr-4 text-sm text-black placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-3">
          <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 focus:outline-none">
          </button>

          {/* Profile Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 rounded-full p-1 transition hover:text-secondary focus:outline-none"
            >
               <CircleUser className='h-8 w-8'/>
            </button>

            {isProfileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border bg-primary py-1 px-2 shadow-2xl ring-1 ring-black/10 z-50"
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                <div className="border-b border-secondary px-4 py-3">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="truncate text-xs text-white">{user.email}</p>
                </div>
                <a href="#profile" className="flex items-center gap-2.5 px-4 py-2 text-sm rounded-md text-white hover:bg-secondary hover:text-accent">
                  <UserIcon className="h-4 w-4" /> Profile Settings
                </a>
                <div className="border-t border-slate-700/60 my-1" />
                <button
                  onClick={() => alert('Logged out')}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm rounded-md text-rose-400 hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
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
            z-40 flex flex-col h-full bg-primary transition-all duration-200 ease-in-out shrink-0
            lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] 
            ${isMobileOpen ? 'fixed inset-y-16 left-0 translate-x-0 w-64 shadow-2xl' : 'fixed inset-y-16 left-0 -translate-x-full lg:translate-x-0'}
            ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}
          `}
        >
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {/* Dashboard Link */}
            <Link
              href="/admin/dashboard"
              className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-white border border-primary hover:border-secondary "
              title={!isSidebarOpen ? 'Dashboard' : undefined}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-5 w-5 shrink-0" />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                  Dashboard
                </span>
              </div>
            </Link>

            {/* doctors Link */}
            <Link
            href="/admin/users?role=doctor" 
            className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-white border border-primary hover:border-secondary "
            title={!isSidebarOpen ? 'Doctors' : undefined}
          >
            <div className="flex items-center gap-3">
              <HeartHandshake className="h-5 w-5 shrink-0" />
              <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                Doctors
              </span>
            </div>
          </Link>

            {/* patients Link */}
            <Link
            href="/admin/users?role=patient" 
            className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-white border border-primary hover:border-secondary "
            title={!isSidebarOpen ? 'Patients' : undefined}
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 shrink-0 " />
              <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                Patients
              </span>
            </div>
          </Link>
               
            {/* manage applications */}
            <Link
              href="/admin/applications"
              className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-white border border-primary hover:border-secondary "
              title={!isSidebarOpen ? 'Applications' : undefined}
            >
              <div className="flex items-center gap-3">
                <AppWindow className="h-5 w-5 shrink-0" />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                  Applications
                </span>
              </div>
            </Link>

              {/* manage service categories */}
            <Link
              href="/admin/service-categories"
              className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-white border border-primary hover:border-secondary "
              title={!isSidebarOpen ? 'Service categories' : undefined}
            >
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="h-5 w-5 shrink-0" />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                  Service categories
                </span>
              </div>
            </Link>

              {/* manage appointments */}
            <Link
              href="/admin/appointments"
              className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-white border border-primary hover:border-secondary "
              title={!isSidebarOpen ? 'Appointments' : undefined}
            >
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 shrink-0" />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                  Appointments
                </span>
              </div>
            </Link>
            
              {/*audit logs */}
            <Link
              href="/admin/audit-logs"
              className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-white border border-primary hover:border-secondary "
              title={!isSidebarOpen ? 'Audit logs' : undefined}
            >
              <div className="flex items-center gap-3">
                <RotateCcwClock className="h-5 w-5 shrink-0" />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                   Audit logs
                </span>
              </div>
            </Link>

            {/* Settings Link */}
            <Link
              href="/admin/settings"
              className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium  text-white border border-primary hover:border-secondary "
              title={!isSidebarOpen ? 'Settings' : undefined}
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 shrink-0" />
                <span className={`${!isSidebarOpen && 'lg:hidden'} truncate`}>
                   Settings
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
};

