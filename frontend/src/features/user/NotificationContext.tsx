"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type NotifType = "match" | "message" | "profile";

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "read">) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "match",
    title: "New Match! 💕",
    body: "You and Elena are now connected.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "message",
    title: "New Message",
    body: "David: \"Hey! How's your week going?\"",
    time: "15 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "message",
    title: "New Message",
    body: "Priya: \"That café sounds perfect.\"",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "n4",
    type: "profile",
    title: "Profile Updated",
    body: "Your profile photo was changed successfully.",
    time: "2 hrs ago",
    read: true,
  },
  {
    id: "n5",
    type: "match",
    title: "New Match! 💕",
    body: "You and Priya matched. Say hello!",
    time: "3 hrs ago",
    read: true,
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((n: Omit<Notification, "id" | "read">) => {
    const id = `n-${Date.now()}`;
    setNotifications((prev) => [{ ...n, id, read: false }, ...prev]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
}
