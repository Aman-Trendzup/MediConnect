"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitDoctorApplication } from "@/services/doctorApi";
import { publicApi } from "@/services/publicApi";

interface ServiceModel {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export default function DoctorApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Services list fetched from backend
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [isFetchingServices, setIsFetchingServices] = useState(true);

  // Form State mapped directly to MongoDB schema fields
  const [formData, setFormData] = useState({
    specialization: "",
    qualifications: "", // Comma-separated string converted to array on submission
    experienceYears: "",
    consultationFee: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Verification Documents upload state (up to 5 files)
  const [documents, setDocuments] = useState<File[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available services on mount
  useEffect(() => {
    let isMounted = true;
    async function loadServices() {
      try {
        setIsFetchingServices(true);
        const response = await publicApi.getServices();
        if (isMounted && response?.success && Array.isArray(response.services)) {
          // Filter only active services if required
          const activeServices = response.services.filter((s: ServiceModel) => s.isActive !== false);
          setServices(activeServices);
        }
      } catch (err) {
        console.error("Failed to fetch services list:", err);
        setError("Could not load specialties list. Please refresh the page.");
      } finally {
        if (isMounted) setIsFetchingServices(false);
      }
    }

    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle standard text / select inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear error on typing
  };

  // Handle document file selections
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > 5) {
        setError("You can upload a maximum of 5 verification documents.");
        return;
      }
      setDocuments(selectedFiles);
      if (error) setError(null);
    }
  };

  // Step validation check before proceeding
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (
        !formData.specialization.trim() ||
        !formData.qualifications.trim() ||
        !formData.experienceYears ||
        !formData.consultationFee
      ) {
        setError("Please fill in all professional information fields before proceeding.");
        return false;
      }
    } else if (step === 2) {
      if (
        !formData.street.trim() ||
        !formData.city.trim() ||
        !formData.state.trim() ||
        !formData.pincode.trim()
      ) {
        setError("Please complete all clinic address fields before proceeding.");
        return false;
      }
    } else if (step === 3) {
      if (documents.length === 0) {
        setError("Please upload at least one verification document before proceeding.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Form Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = new FormData();

      // Professional metrics
      data.append("specialization", formData.specialization);
      data.append("experienceYears", formData.experienceYears);
      data.append("consultationFee", formData.consultationFee);

      // Qualifications array formatting
      const qualificationsArray = formData.qualifications
        .split(",")
        .map((q) => q.trim())
        .filter(Boolean);

      qualificationsArray.forEach((qual) => {
        data.append("qualifications[]", qual);
      });

      // Nested clinicAddress object keys
      data.append("clinicAddress[street]", formData.street);
      data.append("clinicAddress[city]", formData.city);
      data.append("clinicAddress[state]", formData.state);
      data.append("clinicAddress[pincode]", formData.pincode);

      // Multipart File Attachments
      documents.forEach((file) => {
        data.append("documents", file);
      });

      const response = await submitDoctorApplication(data);

      if (response?.success) {
        router.replace("/doctor/application-status");
      } else {
        throw new Error(response?.message || "Failed to submit application.");
      }
    } catch (err: any) {
      console.error("Application submission error:", err);
      setError(
        err?.response?.data?.message ||
          "An error occurred while submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Professional Profile" },
    { number: 2, title: "Clinic Address" },
    { number: 3, title: "Verification Uploads" },
    { number: 4, title: "Review & Submit" },
  ];

  // Find label of selected specialization for the final step view
  const selectedServiceObj = services.find(
    (s) => s._id === formData.specialization || s.name === formData.specialization
  );
  const displaySpecializationName = selectedServiceObj ? selectedServiceObj.name : formData.specialization;

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-5 py-8 text-[#172033] sm:py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2563eb]">
            Doctor Verification Portal
          </p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            Doctor Application Journey
          </h1>
          <p className="mt-2 text-sm text-[#758095]">
            Complete the 4 steps below to submit your credentials for review.
          </p>
        </div>

        {/* Step Journey Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                      currentStep === step.number
                        ? "bg-[#2563eb] text-white ring-4 ring-blue-100 shadow-md"
                        : currentStep > step.number
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {currentStep > step.number ? "✓" : step.number}
                  </div>
                  <span
                    className={`mt-2 hidden text-center text-xs font-semibold sm:block ${
                      currentStep >= step.number ? "text-[#172033]" : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-all ${
                      currentStep > step.number ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Inline Styled Error Banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm transition-all">
            <span className="text-lg">⚠️</span>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Wizard Form Wrapper */}
        <div className="rounded-2xl border border-[#E7EBF1] bg-white p-6 shadow-sm sm:p-10">
          
          {/* STEP 1: Professional Profile */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-[#172033]">Step 1: Professional Information</h2>
                <p className="text-xs text-[#758095]">Provide details regarding your practice and qualifications.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#344054] uppercase tracking-wide">
                    Specialization *
                  </label>
                  <select
                    name="specialization"
                    required
                    value={formData.specialization}
                    onChange={handleChange}
                    disabled={isFetchingServices}
                    className="w-full rounded-xl border border-[#DCE2EA] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] disabled:bg-slate-100"
                  >
                    <option value="">
                      {isFetchingServices ? "Loading specialties..." : "-- Select Specialization --"}
                    </option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#344054] uppercase tracking-wide">
                    Qualifications (Comma Separated) *
                  </label>
                  <input
                    type="text"
                    name="qualifications"
                    required
                    placeholder="e.g. MBBS, MD - General Medicine"
                    value={formData.qualifications}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DCE2EA] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#344054] uppercase tracking-wide">
                    Experience (Years) *
                  </label>
                  <input
                    type="number"
                    name="experienceYears"
                    required
                    min="0"
                    placeholder="e.g. 8"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DCE2EA] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#344054] uppercase tracking-wide">
                    Consultation Fee (₹) *
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    required
                    min="0"
                    placeholder="e.g. 500"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DCE2EA] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Clinic Address */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-[#172033]">Step 2: Clinic Address</h2>
                <p className="text-xs text-[#758095]">Enter the physical location of your medical practice.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-[#344054] uppercase tracking-wide">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="e.g. 123 Health Ave, Suite 4"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DCE2EA] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#344054] uppercase tracking-wide">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. New Delhi"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DCE2EA] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#344054] uppercase tracking-wide">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="e.g. Delhi"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DCE2EA] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#344054] uppercase tracking-wide">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="e.g. 110001"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#DCE2EA] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Verification Documents */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-[#172033]">Step 3: Verification Documents</h2>
                <p className="text-xs text-[#758095]">
                  Upload medical license certificates or ID proof (Up to 5 files: PDF, JPG, PNG).
                </p>
              </div>

              <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DCE2EA] bg-slate-50 p-8 cursor-pointer hover:bg-slate-100 transition">
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#2563eb]">Click to choose verification files</p>
                  <p className="mt-1 text-xs text-slate-400">PDF, PNG, or JPEG (Max 5 files)</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Selected Attachments:</p>
                  {documents.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700">
                      <span>📄 {file.name}</span>
                      <span className="text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Review & Final Submit */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-[#172033]">Step 4: Review Your Details</h2>
                <p className="text-xs text-[#758095]">Verify all entered information prior to final submission.</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5 space-y-4 text-sm">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Credentials</h3>
                  <p className="mt-1 font-semibold text-[#172033]">{displaySpecializationName}</p>
                  <p className="text-xs text-slate-600">Qualifications: {formData.qualifications}</p>
                  <p className="text-xs text-slate-600">Experience: {formData.experienceYears} Years | Fee: ₹{formData.consultationFee}</p>
                </div>

                <hr className="border-slate-200" />

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinic Address</h3>
                  <p className="mt-1 text-xs font-medium text-[#172033]">
                    {formData.street}, {formData.city}, {formData.state} — {formData.pincode}
                  </p>
                </div>

                <hr className="border-slate-200" />

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Uploaded Documents</h3>
                  <p className="mt-1 text-xs text-slate-600">{documents.length} file(s) attached for verification.</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Bar */}
          <div className="mt-8 flex items-center justify-between border-t border-[#E7EBF1] pt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
              className="rounded-xl border border-[#DCE2EA] bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              ← Back
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting Application..." : "Submit Final Application"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}