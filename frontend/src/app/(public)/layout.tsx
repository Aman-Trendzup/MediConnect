import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Sticky Header across all public pages */}
      <Navbar />

      {/* Main Page Content */}
      <div className="flex-1">{children}</div>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}

