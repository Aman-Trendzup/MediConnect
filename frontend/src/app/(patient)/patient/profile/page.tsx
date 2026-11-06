"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  CheckCircle,
  Save,
  Edit3,
} from "lucide-react";
import { patientApi } from "@/services/patientApi";
import { useAuthStore } from "@/store/useAuthStore";


export default function PatientProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any | null>(null);
  const [initialProfile, setInitialProfile] = useState<any | null>(null); 
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
 

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await patientApi.getPatientProfile();
        const userData = res?.user || res?.profile || res?.data || res;

        const formattedProfile = {
          name: userData?.name || user?.name || "",
          email: userData?.email || user?.email || "",
          phone: userData?.phone || "",
        };

        setProfile(formattedProfile);
        setInitialProfile(formattedProfile);
      } catch (err) {
        console.error("Failed to load patient profile:", err);
        const defaultProfile = {
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
        };
        setProfile(defaultProfile);
        setInitialProfile(defaultProfile);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      setSaving(true);
      const res = await patientApi.updatePatientProfile(profile);
      const updatedData = res?.user || res?.profile || res?.data || res;
      
      const newProfileState = {
        ...profile,
        ...(updatedData || {}),
      };

      setProfile(newProfileState);
      setInitialProfile(newProfileState);
      setIsEditing(false); // Lock the form after saving
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfile(initialProfile); // Revert unsaved edits
    setIsEditing(false);
  };


  if (loading || !profile) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <div className="h-64 animate-pulse rounded-3xl bg-white border border-slate-200" />
      </div>
    );
  }

  const initialLetter = (profile.name || "P").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      
      {/* Header Banner & Edit Button Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal contact details, blood group, emergency contacts, and allergies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 shadow-xs">
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Saved successfully!</span>
            </div>
          )}

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#16587b] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#124662] transition cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Overview Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#16587b] text-xl font-extrabold text-white shadow-sm">
              {initialLetter}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900">{profile.name}</h2>
              </div>
              <p className="text-xs text-slate-500">{profile.email}</p>
              <p className="text-xs text-slate-500">Phone: {profile.phone || "Not added"}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Personal Information */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <User className="h-5 w-5 text-[#16587b]" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-400">Basic contact identity used for clinic bookings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none ${
                  isEditing ? "border-slate-300 bg-white focus:border-[#16587b]" : "border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                disabled={!isEditing}
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none ${
                  isEditing ? "border-slate-300 bg-white focus:border-[#16587b]" : "border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number *</label>
              <input
                type="tel"
                required
                disabled={!isEditing}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none ${
                  isEditing ? "border-slate-300 bg-white focus:border-[#16587b]" : "border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
                }`}
              />
            </div>

          </div>
        </div>

        {/* Action Buttons (Visible only when Editing) */}
        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#16587b] px-7 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-[#124662] transition disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving Changes..." : "Save Profile Details"}</span>
            </button>
          </div>
        )}

      </form>
    </div>
  );
}