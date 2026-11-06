"use client";

import { useEffect, useState } from "react";
import { 
  getAvailability, 
  setAvailability as saveAvailabilityApi,
  getBlockedSlots,
  createBlockedSlot,
  deleteBlockedSlot
} from "@/services/doctorApi";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type DayAvailability = {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
  slotDurationMinutes: number;
};

interface BackendScheduleItem {
  _id?: string;
  dayOfWeek: string;
  doctor: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  slotDurationMinutes?: number;
}

interface BlockedSlotItem {
  _id: string;
  date: string;
  reason: string;
}

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<DayAvailability[]>(
    days.map((day) => ({
      day,
      enabled: day !== "Sunday",
      start: "09:00",
      end: "17:00",
      slotDurationMinutes: 30,
    }))
  );

  const [blockedSlots, setBlockedSlots] = useState<BlockedSlotItem[]>([]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load availability and blocked slots on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch weekly availability and blocked slots concurrently
        const [availRes, blockedRes] = await Promise.all([
          getAvailability(),
          getBlockedSlots()
        ]);

        if (availRes?.success && Array.isArray(availRes.schedules)) {
          const fetchedSchedules: BackendScheduleItem[] = availRes.schedules;

          setAvailability((prevDays) =>
            prevDays.map((defaultDay) => {
              const found = fetchedSchedules.find(
                (s) => s.dayOfWeek.toLowerCase() === defaultDay.day.toLowerCase()
              );

              if (found) {
                return {
                  day: defaultDay.day,
                  enabled: found.isAvailable,
                  start: found.startTime || "09:00",
                  end: found.endTime || "17:00",
                  slotDurationMinutes: found.slotDurationMinutes || 30,
                };
              }

              return defaultDay;
            })
          );
        }

        if (blockedRes?.success && Array.isArray(blockedRes.blockedSlots)) {
          setBlockedSlots(blockedRes.blockedSlots);
        }
      } catch (err: any) {
        console.error("Error loading availability data:", err);
        setError(err?.response?.data?.message || "Unable to load availability schedules.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveWeekly = async () => {
    const invalidDay = availability.find(
      (day) => day.enabled && day.start >= day.end
    );

    if (invalidDay) {
      setError(`Please check the working hours for ${invalidDay.day}. End time must be after start time.`);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        schedules: availability.map((item) => ({
          dayOfWeek: item.day,
          isAvailable: item.enabled,
          startTime: item.start,
          endTime: item.end,
          slotDurationMinutes: item.slotDurationMinutes,
        })),
      };

      const response = await saveAvailabilityApi(payload);

      if (response?.success) {
        setSuccessMessage("Weekly schedule updated successfully!");
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        throw new Error(response?.message || "Failed to save availability.");
      }
    } catch (err: any) {
      console.error("Error saving availability:", err);
      setError(err?.response?.data?.message || "Unable to save availability. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBlockedSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate) return;

    setIsBlocking(true);
    setError(null);

    try {
      const response = await createBlockedSlot({
        date: blockDate,
        reason: blockReason.trim() || "Unavailable",
      });

      if (response?.success && response.blockedSlot) {
        setBlockedSlots((prev) => [...prev, response.blockedSlot].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setShowBlockModal(false);
        setBlockDate("");
        setBlockReason("");
        setSuccessMessage("Date successfully blocked!");
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      console.error("Error creating blocked slot:", err);
      setError(err?.response?.data?.message || "Unable to block this date.");
    } finally {
      setIsBlocking(false);
    }
  };

  const handleDeleteBlockedSlot = async (id: string) => {
    setError(null);
    try {
      const response = await deleteBlockedSlot(id);
      if (response?.success) {
        setBlockedSlots((prev) => prev.filter((slot) => slot._id !== id));
        setSuccessMessage("Blocked date removed successfully!");
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      console.error("Error deleting blocked slot:", err);
      setError(err?.response?.data?.message || "Unable to remove blocked date.");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f8fafc]">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#e2e8f0] border-t-[#2563eb]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page heading */}
        <div className="mb-2">
          <h1 className="mt-1 text-3xl font-extrabold text-[#172033] sm:text-4xl">
            Availability & Schedule
          </h1>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm">
            {successMessage}
          </div>
        )}

        {/* SECTION 1: Weekly Working Hours */}
        <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="border-b border-[#e2e8f0] px-6 py-5 bg-slate-50/50">
            <h2 className="text-lg font-bold text-[#172033]">
              Weekly Working Hours
            </h2>
          </div>

          <div className="divide-y divide-[#e2e8f0]">
            {availability.map((item, index) => (
              <div
                key={item.day}
                className="grid grid-cols-1 gap-4 p-5 transition hover:bg-slate-50/50 sm:grid-cols-[160px_1fr_1fr_120px] sm:items-center sm:px-6"
              >
                <label className="flex items-center gap-3 font-semibold text-[#172033] cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary size-4 rounded border-gray-300 text-primary focus:ring-[#2563eb]"
                    checked={item.enabled}
                    onChange={(event) => {
                      const isChecked = event.target.checked;
                      setAvailability((prev) =>
                        prev.map((day, i) =>
                          i === index ? { ...day, enabled: isChecked } : day
                        )
                      );
                    }}
                  />
                  <span className="text-sm">{item.day}</span>
                </label>

                <div className="flex flex-col">
                  <span className="mb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase sm:hidden">
                    Start Time
                  </span>
                  <input
                    type="time"
                    className="w-full rounded-xl border border-[#e2e8f0] bg-white px-3.5 py-2 text-sm text-gray-900 shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] disabled:bg-slate-50 disabled:text-gray-400"
                    value={item.start}
                    disabled={!item.enabled}
                    onChange={(event) => {
                      const val = event.target.value;
                      setAvailability((prev) =>
                        prev.map((day, i) =>
                          i === index ? { ...day, start: val } : day
                        )
                      );
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <span className="mb-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase sm:hidden">
                    End Time
                  </span>
                  <input
                    type="time"
                    className="w-full rounded-xl border border-[#e2e8f0] bg-white px-3.5 py-2 text-sm text-gray-900 shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] disabled:bg-slate-50 disabled:text-gray-400"
                    value={item.end}
                    disabled={!item.enabled}
                    onChange={(event) => {
                      const val = event.target.value;
                      setAvailability((prev) =>
                        prev.map((day, i) =>
                          i === index ? { ...day, end: val } : day
                        )
                      );
                    }}
                  />
                </div>

                <div className="text-left sm:text-center">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      item.enabled
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.enabled ? "Available" : "Day Off"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[#e2e8f0] bg-slate-50/50 px-6 py-4">
            <p className="text-xs text-[#64748b]">
              Changes apply immediately to future patient appointment searches.
            </p>

            <button
              className="rounded-xl bg-[#2563eb] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-primary disabled:opacity-50"
              onClick={handleSaveWeekly}
              disabled={isSaving}
            >
              {isSaving ? "Saving Schedule..." : "Save Weekly Hours"}
            </button>
          </div>
        </section>

        {/* SECTION 2: Blocked Dates & Time-Off */}
        <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-5 bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-[#172033]">
                Blocked Dates & Time-Off
              </h2>
              <p className="mt-0.5 text-xs text-[#64748b]">
                Add specific dates where you are unavailable for appointments.
              </p>
            </div>

            <button
              onClick={() => setShowBlockModal(true)}
              className="rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary"
            >
              + Add Time Off
            </button>
          </div>

          <div className="p-6">
            {blockedSlots.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm font-medium text-[#64748b]">No blocked dates configured.</p>
                <p className="mt-1 text-xs text-slate-400">Click &quot;Add Time Off&quot; to block upcoming personal leave or holidays.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blockedSlots.map((slot) => (
                  <div
                    key={slot._id}
                    className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-white p-4 transition hover:border-blue-200"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#172033]">
                         {new Date(slot.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="mt-0.5 text-xs text-[#64748b]">
                        Reason: <span className="font-medium text-[#172033]">{slot.reason}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteBlockedSlot(slot._id)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Add Blocked Date Modal */}
        {showBlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
                <h2 className="text-lg font-bold text-[#172033]">Block a Date / Time-Off</h2>
                <button
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => setShowBlockModal(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddBlockedSlot} className="my-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#172033] uppercase tracking-wide">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-xl border border-[#e2e8f0] p-3 text-sm text-[#172033] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#172033] uppercase tracking-wide">
                    Reason / Note (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#e2e8f0] p-3 text-sm text-[#172033] placeholder:text-slate-400 focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
                    placeholder="e.g. Medical Conference, Personal Leave"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[#e2e8f0] pt-4">
                  <button
                    type="button"
                    className="rounded-lg border border-[#e2e8f0] px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    onClick={() => setShowBlockModal(false)}
                    disabled={isBlocking}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#2563eb] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-50"
                    disabled={isBlocking}
                  >
                    {isBlocking ? "Blocking..." : "Confirm Block"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}