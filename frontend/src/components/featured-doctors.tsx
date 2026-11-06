"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import DoctorCard, { DoctorModel } from "@/components/doctor-card";
import { publicApi } from "@/services/publicApi";

export default function FeaturedDoctorsSection() {
  const [doctors, setDoctors] = useState<DoctorModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadFeaturedDoctors() {
      try {
        setIsLoading(true);
        const data = await publicApi.getDoctors({ limit: 4 });
        if (isMounted && data) {
          const list = data.doctors || data.data || (Array.isArray(data) ? data : []);
          setDoctors(list.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch featured doctors:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadFeaturedDoctors();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full blur-3xl opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(132, 179, 206, 0.6) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />

      {/* Unified Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#84b3ce]/15 px-3.5 py-1 text-xs font-semibold text-[#16587b] mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#84b3ce]" />
              <span>Verified Medical Specialists</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#16587b] leading-tight">
              Top-Rated Doctors{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16587b] to-[#84b3ce]">
                Ready to Help.
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-500 font-normal">
              Admin-verified practitioners matching approved credentials. Transparent consultation fees with zero online prepayments.
            </p>
          </div>

          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-[#16587b] hover:border-[#84b3ce] hover:bg-slate-50 transition-all self-start md:self-end group shadow-xs cursor-pointer"
          >
            <span>View All Doctors</span>
            <ArrowUpRight className="w-4 h-4 text-[#84b3ce] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 4 DOCTOR CARDS GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-slate-100 border border-slate-200/60 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-200" />
                  <div className="h-5 w-3/4 rounded-lg bg-slate-200" />
                  <div className="h-3 w-1/2 rounded-lg bg-slate-200" />
                  <div className="h-4 w-full rounded-lg bg-slate-200" />
                </div>
                <div className="h-10 w-full rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-500">No featured doctors available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}