"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type NotificationCategory = "appointment" | "account" | "availability";

type DoctorNotification = {
  id: string;
  doctorId: string;
  title: string;
  description: string;
  category: NotificationCategory;
  date: string;
  time?: string;
  isRead: boolean;
  actionLabel?: string;
  actionHref?: string;
};

type FilterType = "all" | "unread" | "appointments" | "account";

export default function DoctorNotificationsPage() {
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case "unread":
        return notifications.filter((item) => !item.isRead);

      case "appointments":
        return notifications.filter((item) => item.category === "appointment");

      case "account":
        return notifications.filter(
          (item) => item.category === "account" || item.category === "availability"
        );

      default:
        return notifications;
    }
  }, [notifications, activeFilter]);

  function markAsRead(notification: DoctorNotification) {
    if (notification.isRead) return;

    setIsUpdating(true);
    setMessage("");

    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id ? { ...item, isRead: true } : item
      )
    );

    setIsUpdating(false);
  }

  function markAllAsRead() {
    const unreadNotifications = notifications.filter((item) => !item.isRead);

    if (unreadNotifications.length === 0) return;

    setIsUpdating(true);
    setMessage("");

    setNotifications((previous) =>
      previous.map((item) => ({ ...item, isRead: true }))
    );

    setMessage("All notifications marked as read.");
    setIsUpdating(false);
  }

  const filters: { label: string; value: FilterType }[] = [
    { label: "All updates", value: "all" },
    { label: `Unread (${unreadCount})`, value: "unread" },
    { label: "Appointments", value: "appointments" },
    { label: "Account & availability", value: "account" },
  ];

  return (
    <div className="min-h-full bg-[#F7F9FC] text-[#172033]">
      <div className="mx-auto max-w-[1050px] px-5 py-8 md:px-9">
        {/* Heading */}
        <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Notifications
            </h1>
            <p className="mt-2 text-sm text-[#758095]">
              Stay up to date with your appointments and professional account.
            </p>
          </div>

          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0 || isUpdating}
            className="rounded-lg border border-[#DCE2EA] bg-white px-4 py-2.5 text-sm font-semibold text-[#596579] transition hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Mark All as Read"}
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-lg border border-[#D9E5FA] bg-[#EFF5FF] px-4 py-3 text-sm text-[#2456A6]">
            {message}
          </div>
        )}

        {/* Summary */}
        <div className="mb-6 rounded-xl border border-[#E7EBF1] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#2864D8]">
              <BellIcon />
            </div>

            <div>
              <p className="font-semibold">
                {unreadCount === 0
                  ? "You're all caught up."
                  : `${unreadCount} unread updates`}
              </p>
              <p className="mt-1 text-xs text-[#8993A4]">
                Your updates remain available below.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeFilter === filter.value
                  ? "bg-[#EAF1FF] text-[#2864D8]"
                  : "border border-[#E7EBF1] bg-white text-[#687386] hover:bg-[#F5F7FA]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <section className="overflow-hidden rounded-xl border border-[#E7EBF1] bg-white">
          <div className="border-b border-[#E7EBF1] px-5 py-4">
            <h2 className="text-sm font-bold">
              {activeFilter === "all"
                ? "All notifications"
                : activeFilter === "unread"
                  ? "Unread notifications"
                  : activeFilter === "appointments"
                    ? "Appointment notifications"
                    : "Account & availability notifications"}
            </h2>

            <p className="mt-1 text-xs text-[#8993A4]">
              {filteredNotifications.length} updates
            </p>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F2F5F9] text-[#8993A4]">
                <BellIcon />
              </div>

              <p className="font-semibold">
                {notifications.length === 0
                  ? "No notifications yet"
                  : "No notifications in this category"}
              </p>

              <p className="mt-2 text-sm text-[#8993A4]">
                {notifications.length === 0
                  ? "Your updates will appear here when you receive them."
                  : "Try selecting another filter to see your updates."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E7EBF1]">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={() => markAsRead(notification)}
                />
              ))}
            </div>
          )}
        </section>

        <p className="mt-5 text-xs text-[#8993A4]">
          Showing {filteredNotifications.length} of {notifications.length} notifications
        </p>
      </div>
    </div>
  );
}

/* Notification card */

function NotificationCard({
  notification,
  onMarkRead,
}: {
  notification: DoctorNotification;
  onMarkRead: () => void;
}) {
  const icon =
    notification.category === "appointment"
      ? "calendar"
      : notification.category === "availability"
        ? "clock"
        : "user";

  const formattedDate = new Date(notification.date).toLocaleString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const formattedTime = notification.time
    ? ` · ${notification.time}`
    : "";

  return (
    <div
      className={`flex flex-col gap-4 px-5 py-5 transition hover:bg-[#FAFBFD] sm:flex-row sm:items-start sm:justify-between ${
        !notification.isRead ? "bg-[#FAFCFF]" : "bg-white"
      }`}
    >
      <div className="flex min-w-0 gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F4FA] text-[#64748B]">
          {icon === "calendar" ? (
            <CalendarIcon />
          ) : icon === "clock" ? (
            <ClockIcon />
          ) : (
            <UserIcon />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">
              {notification.title}
            </h3>

            {!notification.isRead && (
              <span className="h-2 w-2 rounded-full bg-[#2864D8]" />
            )}
          </div>

          <p className="mt-1.5 text-sm leading-6 text-[#687386]">
            {notification.description}
          </p>

          <p className="mt-2 text-xs text-[#8993A4]">
            {formattedDate}
            {formattedTime}
          </p>

          {notification.actionLabel && notification.actionHref && (
            <Link
              href={notification.actionHref}
              className="mt-3 inline-block text-xs font-semibold text-[#2864D8] hover:underline"
            >
              {notification.actionLabel} →
            </Link>
          )}
        </div>
      </div>

      {!notification.isRead && (
        <button
          onClick={onMarkRead}
          className="shrink-0 self-start text-xs font-semibold text-[#2864D8] hover:underline"
        >
          Mark as Read
        </button>
      )}
    </div>
  );
}

/* Icons */

function BellIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </svg>
  );
}