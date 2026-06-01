"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Settings, Heart, LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { logout, getToken } from "@/lib/auth";
import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/features/user/NotificationContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const navItems = [
  { to: "/user/discover", label: "Discover" },
  { to: "/user/matches", label: "Matches" },
  { to: "/user/messages", label: "Messages" },
  { to: "/user/profile", label: "Profile" },
];

const notifIcon = {
  match: "💕",
  message: "💬",
  profile: "✏️",
};

const notifColor = {
  match: "bg-rose-50 border-rose-200",
  message: "bg-pink-50 border-pink-200",
  profile: "bg-purple-50 border-purple-200",
};

export function TopNav() {
  const pathname = usePathname();
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();

  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("You");

  const notifRef = useRef<HTMLDivElement>(null);

  // Fetch user avatar for the nav — load from localStorage first for instant display
  useEffect(() => {
    const AVATAR_KEY = "cl_avatar_url";
    // Show cached avatar immediately (before API responds)
    const cached = localStorage.getItem(AVATAR_KEY);
    if (cached) setAvatarUrl(cached);

    const token = getToken();
    if (!token) return;
    fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.name) setUserName(data.name);
        if (data?.avatarUrl) {
          setAvatarUrl(data.avatarUrl);
          localStorage.setItem(AVATAR_KEY, data.avatarUrl);
        }
      })
      .catch(() => {});
  }, []);

  // Close notif panel when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const handleLogout = () => logout("/");

  const handleNotifOpen = () => {
    setNotifOpen((v) => !v);
    if (!notifOpen) markAllRead();
  };

  return (
    <header
      className="sticky top-0 z-30 border-b"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderColor: "rgba(236, 72, 153, 0.15)",
        boxShadow: "0 2px 20px rgba(236, 72, 153, 0.08)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/user/discover" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-shadow">
            <Heart className="h-4 w-4 text-white fill-white" strokeWidth={0} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            Connect<span className="text-rose-500">Love</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((i) => {
            const active = pathname.startsWith(i.to);
            return (
              <Link
                key={i.to}
                href={i.to}
                className={cn(
                  "relative text-sm font-semibold transition-colors",
                  active ? "text-rose-500" : "text-slate-500 hover:text-rose-400",
                )}
              >
                {i.label}
                {active && (
                  <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-rose-500 to-pink-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              id="notif-btn"
              onClick={handleNotifOpen}
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-rose-50 text-slate-500 hover:text-rose-500"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {notifOpen && (
              <div
                className="absolute right-0 top-12 w-[360px] rounded-2xl border shadow-2xl overflow-hidden z-50"
                style={{
                  background: "rgba(255,255,255,0.97)",
                  borderColor: "rgba(236, 72, 153, 0.2)",
                  boxShadow: "0 20px 60px rgba(236, 72, 153, 0.15), 0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                {/* Panel header */}
                <div
                  className="flex items-center justify-between px-5 py-4 border-b"
                  style={{ borderColor: "rgba(236, 72, 153, 0.12)", background: "linear-gradient(135deg, #fff5f7, #fdf2f8)" }}
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-rose-500" />
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                    {notifications.length > 0 && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-600">
                        {notifications.length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearAll}
                    className="rounded-lg px-3 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                    id="clear-notifs-btn"
                  >
                    Clear all
                  </button>
                </div>

                {/* Notification list */}
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
                        <Bell className="h-5 w-5 text-rose-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">All caught up!</p>
                      <p className="text-xs text-slate-400 mt-1">No new notifications.</p>
                    </div>
                  ) : (
                    <ul className="divide-y" style={{ borderColor: "rgba(236, 72, 153, 0.08)" }}>
                      {notifications.map((n) => (
                        <li
                          key={n.id}
                          className={cn(
                            "flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-rose-50/50",
                            !n.read && "bg-rose-50/30",
                          )}
                        >
                          <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-base", notifColor[n.type])}>
                            {notifIcon[n.type]}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-800 leading-tight">{n.title}</p>
                              {!n.read && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500 leading-snug">{n.body}</p>
                            <p className="mt-1 text-[11px] text-rose-400 font-medium">{n.time}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div
                    className="border-t px-5 py-3 text-center"
                    style={{ borderColor: "rgba(236, 72, 153, 0.12)", background: "linear-gradient(135deg, #fff5f7, #fdf2f8)" }}
                  >
                    <p className="text-xs text-slate-400">Showing all {notifications.length} notifications</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Settings — navigates to /user/settings */}
          <Link
            href="/user/settings"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-all",
              pathname.startsWith("/user/settings")
                ? "bg-rose-100 text-rose-500"
                : "text-slate-500 hover:bg-rose-50 hover:text-rose-500",
            )}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>

          {/* Profile avatar → /user/profile */}
          <Link
            href="/user/profile"
            className="block transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Go to profile"
          >
            <Avatar className="h-9 w-9 border-2 shadow-md" style={{ borderColor: "rgba(236, 72, 153, 0.4)" }}>
              <AvatarImage src={avatarUrl ?? undefined} />
              <AvatarFallback
                className="text-white text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}
              >
                {userName?.[0]?.toUpperCase() ?? <UserRound className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
