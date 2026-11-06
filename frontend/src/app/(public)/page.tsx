import HeroSection from "@/components/hero";
import QuickSearch from "@/components/quick-search";
import SpecialtiesSection from "@/components/specialties";
import HowItWorksSection from "@/components/how-it-works";
import FeaturedDoctorsSection from "@/components/featured-doctors";
import TrustSection from "@/components/trust-safety";
import TestimonialsSection from "@/components/testimonials";
import DoctorRecruitmentSection from "@/components/doctor-recruitment";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Quick Search & Discovery */}
      <QuickSearch />

      {/* 3. Top Specialties & Departments */}
      <SpecialtiesSection />

      {/* 4. How It Works (Animated Stacking Cards) */}
      <HowItWorksSection />

      {/* 5. Featured & Top-Rated Doctors */}
      <FeaturedDoctorsSection /> 

      {/* 7. Trust, Transparency & Safety Highlights (Infinite Right-to-Left Ticker) */}
      <TrustSection />

      {/* 8. Patient Reviews & Clinical Outcomes */}
      <TestimonialsSection />

      {/* 9. Doctor Recruitment / Join as Doctor CTA */}
      <DoctorRecruitmentSection />
    </>
  );
}
