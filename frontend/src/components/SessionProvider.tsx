"use client";

import { useEffect } from "react";
import { getToken, clearToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * SessionProvider historically handled JWT session lifecycle.
 * It is now a simplified wrapper since we use localStorage and want persistent sessions.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  // We no longer clear the token or log out the user on pagehide/reload.
  // The session persists in localStorage until the user explicitly clicks logout.

  return <>{children}</>;
}
