"use client";

import { TopNav } from "@/features/user/TopNav";
import { usePathname } from "next/navigation";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import { NotificationProvider } from "@/features/user/NotificationContext";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/user/onboarding";

  return (
    <OnboardingGuard>
      <NotificationProvider>
        {/* Light pinkish-white gradient background */}
        <div
          className="min-h-screen text-slate-800 selection:bg-rose-500/30"
          style={{
            background: "linear-gradient(135deg, #fff5f7 0%, #fdf2f8 30%, #fff0f3 60%, #fef9ff 100%)",
          }}
        >
          {!isOnboarding && <TopNav />}
          <main className={isOnboarding ? "" : "mx-auto max-w-[1400px] px-6 py-6"}>
            {children}
          </main>
        </div>
      </NotificationProvider>
    </OnboardingGuard>
  );
}
