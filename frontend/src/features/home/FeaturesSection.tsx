/* eslint-disable */
"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Crown, Zap, Heart, MessageCircle, Star, Shield, Sparkles, Video, Globe } from "lucide-react";

const basicFeatures = [
  { icon: Heart, title: "Smart Matching", desc: "AI-powered compatibility algorithm based on personality & values" },
  { icon: MessageCircle, title: "Basic Messaging", desc: "Text chat with up to 5 active matches per day" },
  { icon: Star, title: "Profile Creation", desc: "Detailed profile with photos and personality badges" },
  { icon: Shield, title: "Safety Reports", desc: "Report and block suspicious profiles instantly" },
];

const premiumFeatures = [
  { icon: Sparkles, title: "Unlimited Matches", desc: "No daily limit — explore as many connections as you want" },
  { icon: Crown, title: "Priority Visibility", desc: "Appear at the top of discovery queues in your area" },
  { icon: Video, title: "Video Dates", desc: "Built-in encrypted video calling before meeting in person" },
  { icon: Globe, title: "Global Search", desc: "Connect with singles worldwide, not just your city" },
  { icon: Zap, title: "Instant Icebreakers", desc: "AI-generated conversation starters tailored to both profiles" },
  { icon: Shield, title: "Verified Badge", desc: "Government ID verification — stand out as a trusted member" },
];

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Start your journey",
    color: "from-slate-100 to-slate-50",
    border: "border-slate-200",
    btn: "bg-slate-900 text-white hover:bg-slate-700",
    features: ["5 matches per day", "Basic messaging", "Profile creation", "Safety tools"],
    popular: false,
  },
  {
    name: "Gold",
    price: "₹499",
    period: "per month",
    description: "Most popular choice",
    color: "from-rose-600 to-pink-600",
    border: "border-rose-500",
    btn: "bg-white text-rose-600 hover:bg-rose-50 font-bold",
    features: ["Unlimited matches", "Priority visibility", "Video dates", "AI icebreakers", "Read receipts", "Advanced filters"],
    popular: true,
  },
  {
    name: "Platinum",
    price: "₹999",
    period: "per month",
    description: "The ultimate experience",
    color: "from-violet-600 to-purple-700",
    border: "border-violet-500",
    btn: "bg-white text-violet-700 hover:bg-violet-50 font-bold",
    features: ["Everything in Gold", "Global search", "Verified badge", "Dedicated support", "Profile boost daily", "Exclusive events"],
    popular: false,
  },
];

export function FeaturesSection() {
  const [tab, setTab] = useState<"basic" | "premium">("basic");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="bg-slate-50 py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="text-xs font-semibold tracking-widest text-rose-500 uppercase">Features</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Everything you need to find{" "}
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              your person
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            From smart matching to video dates, we have every tool to help you build a genuine connection.
          </p>
        </motion.div>

        {/* Tab toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full bg-white border border-slate-200 p-1 shadow-sm">
            <button
              onClick={() => setTab("basic")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === "basic"
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Basic Features
            </button>
            <button
              onClick={() => setTab("premium")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === "premium"
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Premium Features
            </button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {(tab === "basic" ? basicFeatures : premiumFeatures).map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-pink-100">
                <feature.icon className="h-5 w-5 text-rose-500" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing plans */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20"
        >
          <h3 className="text-center text-3xl font-bold text-slate-900">Choose your plan</h3>
          <p className="text-center mt-2 text-slate-500">Start free. Upgrade anytime. Cancel whenever.</p>

          <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className={`relative rounded-3xl overflow-hidden ${plan.popular ? "ring-2 ring-rose-500 shadow-2xl shadow-rose-500/20 scale-105" : "border border-slate-200 shadow-sm"}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 py-1.5 text-center text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-600">
                    ✦ MOST POPULAR
                  </div>
                )}
                <div className={`bg-gradient-to-br ${plan.color} p-7 ${plan.popular ? "pt-10" : ""} text-${plan.popular ? "white" : "slate-900"}`}>
                  <p className={`text-sm font-semibold ${plan.popular ? "text-white/80" : "text-slate-500"}`}>{plan.name}</p>
                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className={`mb-1.5 text-sm ${plan.popular ? "text-white/70" : "text-slate-400"}`}>/{plan.period}</span>
                  </div>
                  <p className={`mt-1 text-xs ${plan.popular ? "text-white/70" : "text-slate-400"}`}>{plan.description}</p>
                </div>

                <div className="bg-white p-6">
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100">
                          <Check className="h-3 w-3 text-rose-600" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`mt-6 w-full py-3 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${plan.btn}`}
                  >
                    {plan.name === "Free" ? "Get Started Free" : `Buy ${plan.name}`}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
