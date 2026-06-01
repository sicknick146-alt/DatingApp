"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, clearToken } from "@/lib/auth";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      clearToken();
      router.push("/?reason=unauthenticated");
      return;
    }

    fetch("http://localhost:3001/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then(user => {
        // Enforce onboarding flow
        if (!user.onboardingCompleted && pathname !== "/user/onboarding") {
          router.replace("/user/onboarding");
        } else if (user.onboardingCompleted && pathname === "/user/onboarding") {
          router.replace("/user/discover");
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        clearToken();
        router.push("/");
      });
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
