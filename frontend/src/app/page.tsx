"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/features/home/Navbar";
import { HeroSection } from "@/features/home/HeroSection";
import { AboutSection } from "@/features/home/AboutSection";
import { FeaturesSection } from "@/features/home/FeaturesSection";
import { SafetySection } from "@/features/home/SafetySection";
import { SupportSection } from "@/features/home/SupportSection";
import { Footer } from "@/features/home/Footer";
import { LoginModal } from "@/features/home/LoginModal";
import { SignupModal } from "@/features/home/SignupModal";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldX, X } from "lucide-react";

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [authBanner, setAuthBanner] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("reason") === "unauthenticated") {
      setAuthBanner(true);
      // Remove the query param from the URL without a full reload
      const url = new URL(window.location.href);
      url.searchParams.delete("reason");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      {/* ── Unauthenticated banner ───────────────────────────────────────── */}
      <AnimatePresence>
        {authBanner && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 rounded-2xl bg-slate-900 text-white px-5 py-3.5 shadow-2xl shadow-slate-900/40 max-w-sm w-full mx-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/20">
              <ShieldX className="h-4 w-4 text-rose-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Not logged in</p>
              <p className="text-xs text-white/60">Please sign in to access your dashboard.</p>
            </div>
            <button
              onClick={() => setAuthBanner(false)}
              className="shrink-0 rounded-full p-1 hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4 text-white/60" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar
        onLoginClick={() => setLoginOpen(true)}
        onSignupClick={() => setSignupOpen(true)}
      />

      <main>
        <HeroSection onSignupClick={() => setSignupOpen(true)} />
        <AboutSection />
        <FeaturesSection />
        <SafetySection />
        <SupportSection />
      </main>

      <Footer />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignup={() => setSignupOpen(true)}
      />
      <SignupModal
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </div>
  );
}
