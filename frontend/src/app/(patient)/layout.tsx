"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  User,
  PanelLeft,
  PanelLeftClose,
  ChevronDown,
  LogOut,
  Search,
  HeartPulse,
  ClipboardList,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { checkApplicationStatus } from "@/services/doctorApi"; 

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Doctor Application state
  const [hasApplication, setHasApplication] = useState<boolean>(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check application status on mount and route changes
  useEffect(() => {
    let isMounted = true;

    async function verifyStatus() {
      try {
        const response = await checkApplicationStatus();
        console.log("Application Status API Response:", response);

        const appData = response?.application || response?.data || (response?._id ? response : null);

        if (isMounted) {
          if (appData && appData.status) {
            setHasApplication(true);
            setApplicationStatus(appData.status);
          } else if (response?.success && response?.status) {
            setHasApplication(true);
            setApplicationStatus(response.status);
          } else {
            setHasApplication(false);
            setApplicationStatus(null);
          }
        }
      } catch (err: any) {
        console.warn("No active application found or error:", err?.response?.status || err);
        if (isMounted) {
          setHasApplication(false);
          setApplicationStatus(null);
        }
      }
    }

    if (user) {
      verifyStatus();
    }

    return () => {
      isMounted = false;
    };
  }, [user, pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push("/auth/login");
    }
  };

  const getPageTitle = () => {
    if (pathname.includes("/appointments")) return "My Appointments";
    if (pathname.includes("/profile")) return "Patient Profile";
    if (pathname.includes("/doctor/application-status")) return "Doctor Application Status";
    if (pathname.includes("/doctor/application")) return "Doctor Registration Application";
    return "Patient Portal";
  };

  const navItems: NavigationItem[] = [
    { label: "My Appointments", href: "/patient/appointments", icon: Calendar },
    { label: "My Profile", href: "/patient/profile", icon: User },
    hasApplication
      ? { label: "Application Status", href: "/doctor/application-status", icon: Clock }
      : { label: "Register as Doctor", href: "/doctor/application", icon: ClipboardList },
  ];

  const patientName = user?.name || "Patient";
  const patientEmail = user?.email || "patient@mediconnect.com";
  const initialLetter = (patientName || "P").charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-[#84b3ce]/30 w-full">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-[#16587b] text-white transition-all duration-300 ease-in-out ${
          desktopCollapsed ? "md:w-[84px]" : "md:w-[270px]"
        } ${
          mobileMenuOpen
            ? "translate-x-0 w-[270px] shadow-2xl"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link
            href="/patient/appointments"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-[#16587b] shadow-md transition-transform duration-300 group-hover:scale-105">
              <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6 text-[#84b3ce]" />
            </div>

            <div
              className={`transition-opacity duration-200 ${
                desktopCollapsed ? "md:hidden" : "block"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">MediConnect</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Primary Navigation */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5 scrollbar-thin scrollbar-thumb-white/20">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  title={desktopCollapsed ? item.label : undefined}
                  className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-white text-[#16587b] font-semibold shadow-xs"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="shrink-0">
                    <IconComponent
                      className={`h-5 w-5 transition-colors ${
                        isActive ? "text-[#16587b]" : "text-[#84b3ce] group-hover:text-white"
                      }`}
                    />
                  </span>

                  <span
                    className={`truncate transition-opacity duration-200 ${
                      desktopCollapsed ? "md:hidden" : "block"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Doctor Recruitment / Status Feature Card */}
          <div className="mt-4">
            <Link
              href={hasApplication ? "/doctor/application-status" : "/doctor/application"}
              onClick={() => setMobileMenuOpen(false)}
              className={`group flex items-center gap-3 rounded-xl bg-[#84b3ce]/20 border border-[#84b3ce]/30 p-3 text-xs font-semibold text-white hover:bg-[#84b3ce]/30 transition ${
                desktopCollapsed ? "justify-center" : ""
              }`}
            >
              {hasApplication ? (
                <Clock className="h-4 w-4 text-amber-300 shrink-0 animate-pulse" />
              ) : (
                <ClipboardList className="h-4 w-4 text-[#84b3ce] shrink-0" />
              )}

              <div className={`${desktopCollapsed ? "md:hidden" : "block"}`}>
                <p className="leading-tight">
                  {hasApplication ? "Doctor Application" : "Are you a Doctor?"}
                </p>
                <p className="text-[10px] text-[#84b3ce]">
                  {hasApplication
                    ? `Status: ${applicationStatus?.toUpperCase() || "PENDING"}`
                    : "Apply to register clinic"}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-300 ${
          desktopCollapsed ? "md:pl-[84px]" : "md:pl-[270px]"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  setMobileMenuOpen((prev) => !prev);
                } else {
                  setDesktopCollapsed((prev) => !prev);
                }
              }}
              aria-label="Toggle sidebar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            >
              {desktopCollapsed ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/doctors"
              className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-[#16587b] hover:text-white sm:inline-flex"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Find Doctors</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-1.5 transition hover:bg-slate-50 focus:outline-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16587b] text-xs font-bold text-white shadow-xs">
                  {initialLetter}
                </div>

                <div className="hidden text-left md:block">
                  <p className="max-w-[120px] truncate text-xs font-semibold text-slate-800">
                    {patientName}
                  </p>
                  <p className="text-[10px] text-slate-500">Patient</p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95">
                  <div className="border-b border-slate-100 px-3.5 py-3">
                    <p className="font-semibold text-sm text-slate-900">{patientName}</p>
                    <p className="truncate text-xs text-slate-500">{patientEmail}</p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#16587b]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#16587b]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#16587b]" />
                      Patient Account
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/patient/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/patient/appointments"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>My Appointments</span>
                    </Link>

                    {/* Dynamic Doctor Application Dropdown item */}
                    {hasApplication ? (
                      <Link
                        href="/doctor/application-status"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#16587b] hover:bg-[#84b3ce]/15"
                      >
                        <Clock className="h-4 w-4 text-[#16587b]" />
                        <span>Application Status</span>
                      </Link>
                    ) : (
                      <Link
                        href="/doctor/application"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#16587b] hover:bg-[#84b3ce]/15"
                      >
                        <ClipboardList className="h-4 w-4 text-[#16587b]" />
                        <span>Register as Doctor</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 text-rose-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#16587b] border-t-transparent" />
        </div>
      }
    >
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}