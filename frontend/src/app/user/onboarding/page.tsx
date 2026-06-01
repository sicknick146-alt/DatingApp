"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronRight, Loader2 } from "lucide-react";
import { getToken, clearToken } from "@/lib/auth";
import { StepHeight } from "@/features/onboarding/StepHeight";
import { StepProfession } from "@/features/onboarding/StepProfession";
import { StepCity } from "@/features/onboarding/StepCity";
import { StepBio } from "@/features/onboarding/StepBio";
import { StepTags } from "@/features/onboarding/StepTags";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const STEPS = [
  { id: "height", title: "How tall are you?" },
  { id: "profession", title: "What do you do?" },
  { id: "city", title: "Where do you live?" },
  { id: "bio", title: "Write your bio" },
  { id: "personality", title: "Your personality" },
  { id: "interests", title: "Your interests" },
  { id: "hobbies", title: "Your hobbies" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch initial profile
  useEffect(() => {
    const token = getToken();
    if (!token) {
      clearToken();
      router.push("/");
      return;
    }
    fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        clearToken();
        router.push("/");
      });
  }, [router]);

  const handleNext = async (fieldValues: Record<string, any>, isFinal = false) => {
    if (saving) return;
    setSaving(true);
    const token = getToken();

    const payload = {
      ...fieldValues,
      ...(isFinal ? { onboardingCompleted: true } : {}),
    };

    try {
      const res = await fetch(`${API}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save step");

      // Update local profile state
      setProfile((prev: any) => ({ ...prev, ...payload }));

      if (isFinal) {
        router.push("/user/discover");
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
      // In a real app, show a toast here
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex((prev) => prev - 1);
  };

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  const step = STEPS[currentStepIndex];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Creative Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-rose-500 opacity-20 blur-[100px]" />
      </div>

      <div className="z-10 w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-xl shadow-rose-500/20">
            <Heart className="h-7 w-7 text-white fill-white" strokeWidth={0} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {step.title}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStepIndex
                    ? "w-8 bg-rose-500"
                    : i < currentStepIndex
                    ? "w-4 bg-rose-500/50"
                    : "w-4 bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="min-h-[200px]"
            >
              {currentStepIndex === 0 && (
                <StepHeight profile={profile} onNext={(val) => handleNext({ height: val })} />
              )}
              {currentStepIndex === 1 && (
                <StepProfession profile={profile} onNext={(val) => handleNext({ profession: val })} />
              )}
              {currentStepIndex === 2 && (
                <StepCity profile={profile} onNext={(val) => handleNext({ city: val })} />
              )}
              {currentStepIndex === 3 && (
                <StepBio profile={profile} onNext={(val) => handleNext({ bio: val })} />
              )}
              {currentStepIndex === 4 && (
                <StepTags
                  type="personality"
                  profile={profile}
                  onNext={(val) => handleNext({ personality: val })}
                />
              )}
              {currentStepIndex === 5 && (
                <StepTags
                  type="interests"
                  profile={profile}
                  onNext={(val) => handleNext({ interests: val })}
                />
              )}
              {currentStepIndex === 6 && (
                <StepTags
                  type="hobbies"
                  profile={profile}
                  onNext={(val) => handleNext({ hobbies: val }, true)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Back Button (if not first step) */}
          {currentStepIndex > 0 && (
            <button
              onClick={handleBack}
              disabled={saving}
              className="absolute left-6 top-6 text-sm font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}

          {saving && (
            <div className="absolute bottom-6 left-6 flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
              Saving...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
