"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { 
  LayoutDashboard, 
  CircleUser, 
  Calendar, 
  ClockCheck, 
  Bell, 
  PanelLeft, 
  PanelLeftClose,
  HeartPulse,
  ChevronDown,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const navigation = [
  { label: "Dashboard", href: "/doctor/dashboard", icon: <LayoutDashboard /> },
  { label: "My Profile", href: "/doctor/profile", icon: <CircleUser /> },
  { label: "Availability & Slots", href: "/doctor/availability", icon: <ClockCheck /> },
  { label: "Appointments", href: "/doctor/appointments", icon: <Calendar /> },
];

interface DoctorDashboardWrapperProps {
  doctorName: string;
  pageTitle: string;
  onLogoutClick: () => void;
  children: ReactNode;
}

export default function DoctorDashboardWrapper({
  doctorName: propDoctorName,
  pageTitle,
  onLogoutClick,
  children,
}: DoctorDashboardWrapperProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name || propDoctorName || "Doctor";
  const displayEmail = user?.email || "doctor@mediconnect.com";

  // Close dropdown on click outside
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

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-[#172033]">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Fixed Full-Height Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-[#e2e8f0] bg-primary transition-all duration-300 ease-in-out ${
          desktopCollapsed ? "md:w-[88px]" : "md:w-[280px]"
        } ${
          mobileMenuOpen ? "translate-x-0 w-[280px] shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[80px] shrink-0 items-center gap-3 px-6 md:px-7">
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-[#16587b] shadow-md transition-transform duration-300 group-hover:scale-105">
              <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6 text-[#84b3ce]" />
            </div>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-[21px] font-bold tracking-tight text-white transition-opacity duration-200 ${
              desktopCollapsed ? "md:hidden" : "block"
            }`}
          >
            MediConnect
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 pt-6 md:px-5">
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  title={desktopCollapsed ? item.label : undefined}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#eff6ff] text-primary font-semibold shadow-xs"
                      : "text-white hover:bg-slate-800 hover:text-secondary"
                  }`}
                >
                  <span className="w-4 shrink-0 text-center text-lg">{item.icon}</span>
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
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-300 ${
          desktopCollapsed ? "md:pl-[88px]" : "md:pl-[280px]"
        }`}
      >
        {/* Sticky Navbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white bg-primary px-5 backdrop-blur-md md:px-9">
          {/* Left section */}
          <div className="flex min-w-0 items-center gap-3 md:gap-5">
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileMenuOpen((prev) => !prev);
                } else {
                  setDesktopCollapsed((prev) => !prev);
                }
              }}
              aria-label="Toggle sidebar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl text-white transition focus:outline-none hover:text-gray-300"
            >
              {desktopCollapsed ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            </button>
          </div>

          {/* Profile Dropdown  */}
          <div className="relative ml-3 flex shrink-0 items-center gap-3 md:gap-5" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-800/60 focus:outline-none"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe] text-sm font-semibold text-[#2563eb]">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </button>

            {/* User Dropdown Menu (Shows Name & Email) */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-lg border border-slate-700 bg-white py-1 px-1 shadow-2xl ring-1 ring-black/10 z-50">
                <div className="border-b border-slate-700/80 px-3 py-2.5">
                  <p className="text-xs font-bold text-slate-800">{displayName}</p>
                  <p className="text-xs text-[#64748b]">{displayEmail}</p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogoutClick();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#dc2626] transition hover:bg-red-500 hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}