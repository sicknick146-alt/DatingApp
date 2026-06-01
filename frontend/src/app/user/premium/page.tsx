"use client";

import { useState } from "react";
import { Check, X, Crown, Diamond, Send, Lock, Shield } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  icon: React.ReactNode;
  name: string;
  tagline: string;
  price: number;
  period: string;
  popular: boolean;
  buttonLabel: string;
  buttonStyle: "gray" | "blue" | "purple";
  features: { label: string; included: boolean }[];
}

const plans: Plan[] = [
  {
    id: "basic",
    icon: <Send className="h-6 w-6 text-slate-500" />,
    name: "Basic Plan",
    tagline: "For getting started",
    price: 0,
    period: "month",
    popular: false,
    buttonLabel: "Get Started",
    buttonStyle: "gray",
    features: [
      { label: "20 Likes per day", included: true },
      { label: "Basic Matching", included: true },
      { label: "Chat after Match", included: true },
      { label: "View Basic Profile", included: true },
      { label: "See Who Liked You", included: false },
      { label: "Super Likes", included: false },
      { label: "Profile Boost", included: false },
      { label: "No Ads", included: false },
    ],
  },
  {
    id: "premium",
    icon: <Diamond className="h-6 w-6 text-blue-500" />,
    name: "Premium Plan",
    tagline: "Most loved features",
    price: 199,
    period: "month",
    popular: true,
    buttonLabel: "Choose Premium",
    buttonStyle: "blue",
    features: [
      { label: "Unlimited Likes", included: true },
      { label: "See Who Liked You", included: true },
      { label: "5 Super Likes per day", included: true },
      { label: "Profile Boost (1 per week)", included: true },
      { label: "No Ads", included: true },
      { label: "Priority Matching", included: true },
      { label: "Advanced Filters", included: false },
    ],
  },
  {
    id: "elite",
    icon: <Crown className="h-6 w-6 text-purple-500" />,
    name: "Elite Plan",
    tagline: "For serious connections",
    price: 399,
    period: "month",
    popular: false,
    buttonLabel: "Choose Elite",
    buttonStyle: "purple",
    features: [
      { label: "Unlimited Likes", included: true },
      { label: "See Who Liked You", included: true },
      { label: "Unlimited Super Likes", included: true },
      { label: "Unlimited Profile Boost", included: true },
      { label: "Priority Matching", included: true },
      { label: "Advanced Filters", included: true },
      { label: "Top Search Ranking", included: true },
      { label: "Premium Badge", included: true },
      { label: "No Ads", included: true },
    ],
  },
];

const btnClasses: Record<string, string> = {
  gray: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200",
  blue: "text-white shadow-lg shadow-blue-500/30 hover:opacity-90",
  purple: "text-white shadow-lg shadow-purple-500/30 hover:opacity-90",
};

const btnStyle: Record<string, React.CSSProperties> = {
  gray: {},
  blue: { background: "linear-gradient(135deg,#3b82f6,#2563eb)" },
  purple: { background: "linear-gradient(135deg,#a855f7,#7c3aed)" },
};

const iconBg: Record<string, string> = {
  basic: "bg-slate-100",
  premium: "bg-blue-50",
  elite: "bg-purple-50",
};

export default function PremiumPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleChoose = (plan: Plan) => {
    if (plan.id === "basic") {
      toast.success("You're already on the Basic plan — explore and enjoy!");
      return;
    }
    setSelected(plan.id);
    toast.success(`${plan.name} selected! Redirecting to payment…`);
    setTimeout(() => toast.info("Payment gateway coming soon!"), 1500);
  };

  return (
    <div className="pb-8 -mx-6 -mt-6 px-6 pt-6 rounded-none"
      style={{ background: "linear-gradient(135deg,#fff5f7 0%,#fdf2f8 40%,#f5f3ff 100%)", minHeight: "calc(100vh - 4rem)" }}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="pt-12 pb-10 text-center px-4 relative">
        {/* Decorative hearts */}
        <div className="pointer-events-none absolute left-[8%] top-8 text-4xl opacity-70 rotate-[-15deg]">🩷</div>
        <div className="pointer-events-none absolute right-[8%] top-10 text-5xl opacity-60 rotate-[10deg]">🩷</div>
        <div className="pointer-events-none absolute left-[20%] bottom-0 text-3xl opacity-50 rotate-[5deg]">🩷</div>
        <div className="pointer-events-none absolute right-[22%] bottom-2 text-2xl opacity-40 rotate-[-8deg]">🩷</div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase mb-5"
          style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.2)" }}
        >
          <span>🩷</span> Choose Your Plan
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          Find Your{" "}
          <span className="text-rose-500" style={{ fontStyle: "italic" }}>Perfect</span>{" "}
          Match
        </h1>
        <p className="mt-3 text-slate-500 text-base max-w-md mx-auto">
          Upgrade your experience and connect with amazing people
        </p>
      </div>

      {/* ── Plans Grid ───────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-6 sm:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl bg-white transition-all duration-200 ${
                plan.popular
                  ? "shadow-2xl ring-2 ring-blue-400 scale-[1.03] z-10"
                  : "shadow-md hover:shadow-xl"
              } ${selected === plan.id ? "ring-2 ring-rose-400" : ""}`}
            >
              {/* Most Popular badge */}
              {plan.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-5 py-1.5 text-xs font-bold text-white shadow-lg flex items-center gap-1.5"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)" }}
                >
                  ⭐ MOST POPULAR
                </div>
              )}

              <div className="flex flex-col flex-1 p-7">
                {/* Icon */}
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg[plan.id]}`}>
                  {plan.icon}
                </div>

                {/* Name & price */}
                <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
                <p className="text-sm text-slate-400 mb-4">{plan.tagline}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">
                    ₹{plan.price}
                  </span>
                  <span className="text-slate-400 text-sm">/{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5 text-sm">
                      {f.included ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                          <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100">
                          <X className="h-3 w-3 text-slate-400" strokeWidth={2.5} />
                        </span>
                      )}
                      <span className={f.included ? "text-slate-700" : "text-slate-400"}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleChoose(plan)}
                  className={`w-full rounded-2xl py-3.5 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${btnClasses[plan.buttonStyle]}`}
                  style={btnStyle[plan.buttonStyle]}
                >
                  {plan.buttonLabel}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer trust badges ──────────────────────────────────────────────── */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-slate-400" /> Secure Payment
          </span>
          <span className="text-slate-200">•</span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-slate-400" /> Cancel Anytime
          </span>
          <span className="text-slate-200">•</span>
          <span>100% Safe &amp; Private</span>
        </div>
      </div>
    </div>
  );
}
