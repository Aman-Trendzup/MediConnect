"use client";

import { useEffect, useState } from "react";
import { getDoctorProfile, updateDoctorProfile } from "@/services/doctorApi";

type ClinicAddress = {
  street: string;
  city: string;
  state: string;
  pincode: string;
};

type Specialization = {
  _id: string;
  name: string;
  description: string;
};

type UserInfo = {
  _id: string;
  name: string;
  email: string;
};

type ProfileState = {
  specializationName: string;
  qualifications: string; 
  experienceYears: string;
  bio: string;
  consultationFee: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isPublished: boolean;
};

const emptyProfile: ProfileState = {
  specializationName: "",
  qualifications: "",
  experienceYears: "",
  bio: "",
  consultationFee: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  isPublished: false,
};

export default function DoctorProfilePage() {
  const [doctorName, setDoctorName] = useState("Doctor");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [profile, setProfile] = useState<ProfileState>(emptyProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setMessage("");

        const response = await getDoctorProfile();

        if (response?.success && response?.doctorProfile) {
          const docProfile = response.doctorProfile;

          setDoctorName(docProfile.user?.name || "Doctor");
          setDoctorEmail(docProfile.user?.email || "");

          setProfile({
            specializationName: docProfile.specialization?.name || "",
            qualifications: Array.isArray(docProfile.qualifications)
              ? docProfile.qualifications.join(", ")
              : docProfile.qualifications || "",
            experienceYears: docProfile.experienceYears?.toString() || "",
            bio: docProfile.bio || "",
            consultationFee: docProfile.consultationFee?.toString() || "",
            street: docProfile.clinicAddress?.street || "",
            city: docProfile.clinicAddress?.city || "",
            state: docProfile.clinicAddress?.state || "",
            pincode: docProfile.clinicAddress?.pincode || "",
            isPublished: docProfile.isPublished ?? false,
          });
        } else {
          throw new Error("Could not load doctor profile information.");
        }
      } catch (error: any) {
        console.error("Profile loading error:", error);
        setMessage(
          error?.response?.data?.message ||
            error instanceof Error
            ? error.message
            : "Something went wrong while loading your profile."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  function updateField(field: keyof ProfileState, value: string | boolean) {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function saveProfile() {
    setIsSaving(true);
    setMessage("");

    try {
      // Format payload to match backend expectations
      const payload = {
        consultationFee: Number(profile.consultationFee) || 0,
        experienceYears: Number(profile.experienceYears) || 0,
        bio: profile.bio,
        qualifications: profile.qualifications
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean),
        clinicAddress: {
          street: profile.street,
          city: profile.city,
          state: profile.state,
          pincode: profile.pincode,
        },
      };

      const response = await updateDoctorProfile(payload);

      if (response?.success) {
        setMessage("Your profile changes have been saved successfully.");
        setIsEditing(false);
      } else {
        throw new Error(response?.message || "Could not save your profile.");
      }
    } catch (error: any) {
      console.error("Profile save error:", error);
      setMessage(
        error?.response?.data?.message ||
          error instanceof Error
          ? error.message
          : "Unable to save profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#F7F9FC]">
        <span className="loading loading-spinner loading-lg text-[#2563eb]" />
      </div>
    );
  }

  const initials = doctorName
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const fullAddress = [profile.street, profile.city, profile.state, profile.pincode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-full bg-[#F7F9FC] text-[#172033]">
      <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-9">
        {/* Page heading */}
        <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              My professional profile
            </h1>
          </div>

          {!isEditing && (
            <button
              onClick={() => {
                setMessage("");
                setIsEditing(true);
              }}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-[#D9E5FA] bg-[#EFF5FF] px-4 py-3 text-sm text-[#2456A6]">
            {message}
          </div>
        )}

        {/* Profile content */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_330px]">
          <div className="space-y-6">
            {/* Professional identity */}
            <section className="rounded-xl border border-[#E7EBF1] bg-white p-5 md:p-7 shadow-sm">
              <SectionHeading
                title="Professional identity"
                description="Your name and professional credentials."
              />

              <div className="mb-7 flex flex-wrap items-center gap-5">
                <div className="flex h-15 w-15 items-center justify-center overflow-hidden rounded-full bg-primary text-xl font-bold text-white">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div>

                  <p className="mt-1 text-sm font-bold text-[#172033]">
                    {doctorName}
                  </p>
                  <p className="mt-0.5 text-xs text-[#758095]">
                    {profile.specializationName || "Specialization not specified"}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Full name" value={doctorName} disabled />
                <Field
                  label="Specialization"
                  value={profile.specializationName}
                  disabled
                  helper="Managed via admin verification profile"
                />
                <Field
                  label="Qualifications (comma separated)"
                  value={profile.qualifications}
                  editing={isEditing}
                  onChange={(value) => updateField("qualifications", value)}
                  placeholder="e.g. MBBS, MD - General Medicine"
                />
                <Field
                  label="Experience (years)"
                  value={profile.experienceYears}
                  editing={isEditing}
                  onChange={(value) => updateField("experienceYears", value)}
                  type="number"
                />
              </div>
            </section>

            {/* Biography */}
            <section className="rounded-xl border border-[#E7EBF1] bg-white p-5 md:p-7 shadow-sm">
              <SectionHeading
                title="Biography"
                description="Help patients understand your background and approach to care."
              />

              {isEditing ? (
                <div>
                  <textarea
                    value={profile.bio}
                    onChange={(event) => updateField("bio", event.target.value)}
                    maxLength={1000}
                    rows={5}
                    placeholder="Describe your medical background..."
                    className="w-full rounded-lg border border-[#DCE2EA] p-3 text-sm text-[#172033] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-2 text-right text-xs text-[#8993A4]">
                    {profile.bio.length} / 1,000 characters
                  </p>
                </div>
              ) : (
                <p className="text-sm leading-7 text-[#596579]">
                  {profile.bio || "No biography added yet."}
                </p>
              )}
            </section>

            {/* Consultation details */}
            <section className="rounded-xl border border-[#E7EBF1] bg-white p-5 md:p-7 shadow-sm">
              <SectionHeading
                title="Consultation details"
                description="Your consultation fee."
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Consultation fee"
                  value={profile.consultationFee}
                  editing={isEditing}
                  onChange={(value) => updateField("consultationFee", value)}
                  prefix="₹"
                  type="number"
                />
              </div>
            </section>

            {/* Clinic address */}
            <section className="rounded-xl border border-[#E7EBF1] bg-white p-5 md:p-7 shadow-sm">
              <SectionHeading
                title="Clinic & location details"
                description="Your clinic address information."
              />

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Street address"
                  value={profile.street}
                  editing={isEditing}
                  onChange={(value) => updateField("street", value)}
                  placeholder="e.g. 123 Healthcare Avenue"
                />
                <Field
                  label="City"
                  value={profile.city}
                  editing={isEditing}
                  onChange={(value) => updateField("city", value)}
                  placeholder="e.g. New Delhi"
                />
                <Field
                  label="State"
                  value={profile.state}
                  editing={isEditing}
                  onChange={(value) => updateField("state", value)}
                  placeholder="e.g. Delhi"
                />
                <Field
                  label="Pincode"
                  value={profile.pincode}
                  editing={isEditing}
                  onChange={(value) => updateField("pincode", value)}
                  placeholder="e.g. 110001"
                />
              </div>
            </section>

            {/* Save / cancel */}
            {isEditing && (
              <div className="flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => window.location.reload()}
                  disabled={isSaving}
                  className="rounded-lg border border-[#DCE2EA] bg-white px-5 py-3 text-sm font-semibold text-[#596579] hover:bg-[#F7F9FC]"
                >
                  Cancel
                </button>

                <button
                  onClick={saveProfile}
                  disabled={isSaving}
                  className="rounded-lg bg-[#2563eb] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {/* Right column: Patient-facing preview */}
          <div className="space-y-6">
            <section className="rounded-xl border border-[#E7EBF1] bg-white p-5 shadow-sm">
              <SectionHeading
                title="Patient-facing preview"
                description="Card preview on patient search"
              />

              <div className="rounded-xl border border-[#E7EBF1] p-4 bg-slate-50/50">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-bold text-white">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#172033]">{doctorName}</p>
                    <p className="text-xs text-[#758095]">
                      {profile.specializationName || "Specialization"}
                    </p>
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#8993A4] uppercase tracking-wider">
                  Qualifications
                </p>
                <p className="mt-1 text-sm text-[#172033]">
                  {profile.qualifications || "Not added"}
                </p>

                <div className="my-3 border-t border-[#E7EBF1]" />

                <p className="text-xs font-semibold text-[#8993A4] uppercase tracking-wider">
                  Experience
                </p>
                <p className="mt-1 text-sm text-[#172033]">
                  {profile.experienceYears ? `${profile.experienceYears} Years` : "Not added"}
                </p>

                <div className="my-3 border-t border-[#E7EBF1]" />

                <p className="text-xs font-semibold text-[#8993A4] uppercase tracking-wider">
                  Clinic Location
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#758095]">
                  {fullAddress || "Address not provided"}
                </p>

                <div className="my-4 border-t border-[#E7EBF1]" />

                <div className="flex items-baseline justify-between">
                  <p className="text-lg font-extrabold text-[#172033]">
                    {profile.consultationFee ? `₹${profile.consultationFee}` : "Fee not set"}
                    <span className="text-xs font-normal text-[#758095]"> / visit</span>
                  </p>
                </div>

                <button
                  disabled
                  className="mt-5 w-full rounded-lg bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white opacity-70 cursor-not-allowed"
                >
                  Book Appointment Preview
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable components */

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-bold text-[#172033]">{title}</h2>
      <p className="mt-0.5 text-xs leading-5 text-[#8993A4]">{description}</p>
    </div>
  );
}

function Field({
  label,
  value,
  editing = false,
  disabled = false,
  onChange,
  helper,
  placeholder,
  type = "text",
  prefix,
}: {
  label: string;
  value: string;
  editing?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  helper?: string;
  placeholder?: string;
  type?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-[#344054] uppercase tracking-wide">
        {label}
      </label>

      {editing && !disabled ? (
        <div className="flex overflow-hidden rounded-xl border border-[#DCE2EA] bg-white focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-blue-100">
          {prefix && (
            <span className="flex items-center border-r border-[#DCE2EA] bg-[#F7F9FC] px-3 text-sm text-[#758095]">
              {prefix}
            </span>
          )}

          <input
            type={type}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            className="min-w-0 w-full px-3.5 py-2.5 text-sm text-[#172033] outline-none"
          />
        </div>
      ) : (
        <div className="min-h-[42px] rounded-xl border border-[#E7EBF1] bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-[#596579] flex items-center">
          {prefix}
          {value || "Not provided"}
        </div>
      )}

      {helper && (
        <p className="mt-1 text-[11px] leading-relaxed text-[#8993A4]">
          {helper}
        </p>
      )}
    </div>
  );
}