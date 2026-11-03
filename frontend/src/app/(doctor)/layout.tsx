"use client";

import type { ReactNode } from "react";
import DoctorDashboardWrapper from "@/components/DoctorDashboardWrapper";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <DoctorDashboardWrapper
      doctorName="Doctor"
      pageTitle="Workspace"
      onLogoutClick={() => {
        window.location.href = "/auth/login";
      }}
    >
      {children}
    </DoctorDashboardWrapper>
  );
}