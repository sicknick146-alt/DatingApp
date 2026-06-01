/* eslint-disable */
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Sparkles, ShieldCheck } from "lucide-react";

export function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="bg-white py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-20 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs font-semibold tracking-widest text-rose-500 uppercase">Our Philosophy</span>
          <h2 className="mt-4 text-5xl font-bold leading-[1.1] tracking-tight text-slate-900">
            A New Era of{" "}
            <em className="not-italic bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Intimacy
            </em>
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-md">
            We&apos;ve reimagined connection for the modern age, reducing the fatigue of endless swiping with intentional design and authentic interactivity.
          </p>

          <div className="mt-10 space-y-6">
            {[
              {
                icon: Heart,
                color: "from-rose-100 to-pink-100",
                iconColor: "text-rose-500",
                title: "Emotional Integrity",
                desc: "Our technology explores and nurtures shared values and long-term goals over fleeting visual attraction.",
              },
              {
                icon: Sparkles,
                color: "from-violet-100 to-purple-100",
                iconColor: "text-violet-500",
                title: "Intuitive AI",
                desc: "AI that learns your communication style and enriches the gap between initial 'hi' and serious connection.",
              },
              {
                icon: ShieldCheck,
                color: "from-emerald-100 to-teal-100",
                iconColor: "text-emerald-500",
                title: "Verified Community",
                desc: "Every member is verified through multi-stage AI authentication to protect your privacy while ensuring you meet real people.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}>
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — visual block */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          {/* Stats card */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 p-8">
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "500K+", label: "Active Members" },
                { value: "94%", label: "Match Satisfaction" },
                { value: "12K+", label: "Couples Formed" },
                { value: "4.9★", label: "App Store Rating" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm border border-rose-50">
                  <div className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Decorative quote */}
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-6 text-white">
              <p className="text-sm italic leading-relaxed opacity-90">
                "We joined a 500,000-strong community. No stress, no shouting — just two people seeing each other."
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold">T</div>
                <div>
                  <p className="text-xs font-semibold">Thomas &amp; Priya</p>
                  <p className="text-xs opacity-70">Matched 8 months ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating accent */}
          <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 opacity-20 blur-xl" />
        </motion.div>
      </div>
    </section>
  );
}
