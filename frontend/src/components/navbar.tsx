"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  HeartPulse,
  User,
  ArrowUpRight,
  Menu,
  X,
  Calendar,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

function NavContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Zustand Auth Store
  const { user, logout, checkAuth } = useAuthStore();

  // Hydrate auth status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Find Doctors", href: "/doctors" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
  ];

  // Helper to determine dashboard link and title based on role
  const getDashboardDetails = () => {
    if (!user) {
      return {
        href: "/auth/login",
        label: "Login",
        profileHref: "/auth/login",
      };
    }
    if (user.role === "admin") {
      return {
        href: "/admin/dashboard",
        label: "View Dashboard",
        profileHref: "/admin/dashboard",
      };
    }
    if (user.role === "doctor") {
      return {
        href: "/doctor/dashboard",
        label: "View Dashboard",
        profileHref: "/doctor/profile",
      };
    }
    return {
      href: "/patient/appointments",
      label: "My Appointments",
      profileHref: "/patient/profile",
    };
  };

  const dashboard = getDashboardDetails();

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-4 sm:top-6 z-50 w-full px-4 sm:px-6 pointer-events-none">
      {/* Standard Container Layout across all sections */}
      <div className="max-w-7xl mx-auto flex items-center justify-center">

        {/* ==================== FLOATING DARK PILL CAPSULE ==================== */}
        <div className="w-full max-w-4xl rounded-full bg-[#16587b] px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xl shadow-[#16587b]/25 border border-white/15 backdrop-blur-xl flex items-center justify-between pointer-events-auto">

          {/* 1. LEFT: CIRCULAR WHITE LOGO BADGE */}
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
            aria-label="MediConnect Home"
          >
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-[#16587b] shadow-md transition-transform duration-300 group-hover:scale-105">
              <HeartPulse className="h-5 w-5 sm:h-6 sm:w-6 text-[#84b3ce]" />
            </div>
            <span className="hidden xl:inline-block text-sm font-bold text-white tracking-tight pl-1">
              Medi<span className="text-[#84b3ce]">Connect</span>
            </span>
          </Link>

          {/* 2. CENTER: TEXT NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs lg:text-sm font-semibold transition-colors duration-200 hover:text-white ${
                    isActive ? "text-white font-bold" : "text-slate-300"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* 3. RIGHT: PROFILE / LOGIN + BOOK APPOINTMENT PILL */}
          <div className="hidden md:flex items-center gap-2.5">

            {/* Profile / Login Icon Button */}
            {user ? (
              // ==================== LOGGED IN STATE ====================
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer border border-white/15 shadow-sm"
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#84b3ce] text-[#16587b] font-bold text-xs uppercase shadow-xs">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown
                    className={`h-3 w-3 text-slate-300 transition-transform duration-200 ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-slate-100 p-2 shadow-2xl shadow-black/20 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-[#16587b] truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#16587b]">
                          {user.role} Account
                        </span>
                      </div>
                    </div>

                    {/* Role-based Dashboard */}
                    <Link
                      href={dashboard.href}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#84b3ce]/15 hover:text-[#16587b] transition"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-3.5 w-3.5 text-[#16587b]" />
                        <span>{dashboard.label}</span>
                      </div>
                      <ArrowUpRight className="h-3 w-3 text-slate-400" />
                    </Link>

                    {/* Profile Link */}
                    {user.role !== "admin" && (
                      <Link
                        href={dashboard.profileHref}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#16587b] transition"
                      >
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>My Profile</span>
                      </Link>
                    )}

                    <div className="my-1 border-t border-slate-100" />

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer text-left"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // ==================== LOGGED OUT STATE: LOGIN BUTTON ====================
              <Link
                href="/auth/login"
                className="flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span>Login</span>
              </Link>
            )}

          </div>

          {/* ==================== MOBILE MENU BUTTON ==================== */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#84b3ce] text-[#16587b] font-bold text-xs uppercase shadow-sm"
                aria-label="User profile"
              >
                {user.name ? user.name.charAt(0) : "U"}
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
                aria-label="Login"
              >
                <User className="h-3.5 w-3.5" />
              </Link>
            )}

            <Link
              href="/doctors"
              className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#16587b]"
            >
              Book
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

        </div>

      </div>

      {/* ==================== MOBILE DROPDOWN DRAWER ==================== */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 max-w-4xl mx-auto rounded-3xl bg-[#16587b] border border-white/15 p-4 shadow-2xl backdrop-blur-xl pointer-events-auto">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition"
              >
                {link.name}
              </Link>
            ))}

            <div className="my-2 border-t border-white/10" />

            {user ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-300 truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-[#84b3ce]">
                    {user.role}
                  </span>
                </div>

                <Link
                  href={dashboard.href}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-white hover:bg-white/10"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#84b3ce]" />
                  <span>{dashboard.label}</span>
                </Link>

                {user.role !== "admin" && (
                  <Link
                    href={dashboard.profileHref}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white"
                  >
                    <User className="h-4 w-4 text-[#84b3ce]" />
                    <span>My Profile</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-rose-300 hover:bg-rose-500/10 transition text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 py-3 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                <User className="h-4 w-4" />
                <span>Login to Account</span>
              </Link>
            )}

          </nav>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <div className="sticky top-4 sm:top-6 z-50 w-full px-4 sm:px-6 pointer-events-none">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <div className="w-full max-w-4xl h-14 rounded-full bg-[#16587b]/80 backdrop-blur-xl border border-white/15 animate-pulse" />
          </div>
        </div>
      }
    >
      <NavContent />
    </Suspense>
  );
}