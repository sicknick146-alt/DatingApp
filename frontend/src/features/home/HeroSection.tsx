/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Star } from "lucide-react";

interface HeroSectionProps {
  onSignupClick: () => void;
}

export function HeroSection({ onSignupClick }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0D0B2B 0%, #1A0933 40%, #2D0B3F 70%, #0D1A3A 100%)",
      }}
    >
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-rose-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-600/20 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-pink-500/10 blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 mb-8 backdrop-blur-sm">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-medium text-white/80">Trusted by 500K+ singles</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-white">
            Find the{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-rose-400 to-pink-300 bg-clip-text text-transparent">
                spark
              </span>
            </span>
            <br />
            that feels
            <br />
            <span className="text-white/90">like home</span>
          </h1>

          <p className="mt-6 max-w-md text-base md:text-lg text-white/60 leading-relaxed">
            Experience a premium sanctuary for modern connection. We prioritise
            emotional resonance and safety over superficial swiping.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              id="hero-getstarted-btn"
              onClick={onSignupClick}
              className="px-8 py-4 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 shadow-xl shadow-rose-500/40 hover:shadow-rose-500/60 transition-all hover:scale-105 active:scale-95"
            >
              Start Your Journey →
            </button>
            <button className="flex items-center gap-2.5 px-6 py-4 text-sm font-medium text-white/80 hover:text-white transition-colors group">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/8 group-hover:bg-white/15 transition-colors">
                <Play className="h-3.5 w-3.5 fill-white text-white ml-0.5" />
              </span>
              Watch our Story
            </button>
          </div>
        </motion.div>

        {/* Right — Image card */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Main image card */}
          <div className="relative h-[520px] w-[380px]">
            {/* Glow behind */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-500/30 to-purple-600/30 blur-2xl scale-110" />

            <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
              <Image
                src="/hero-couple.png"
                alt="Happy couple connecting on Connect Love"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B2B]/70 via-transparent to-transparent" />
            </div>

            {/* Floating review card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="absolute -bottom-4 -left-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 max-w-[220px] shadow-xl"
            >
              <p className="text-xs text-white/70 italic leading-relaxed">
                "A sanctuary for meaningful connection."
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white text-[10px] font-bold">A</div>
                <div>
                  <p className="text-xs font-semibold text-white">Aisha &amp; James</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-2 w-2 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Online users badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="absolute -top-4 -right-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white">12,438 online now</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
