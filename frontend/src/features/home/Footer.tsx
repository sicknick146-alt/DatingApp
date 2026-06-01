/* eslint-disable */
"use client";

import Link from "next/link";
import { Heart, Instagram, Twitter, Facebook, Youtube, ArrowRight } from "lucide-react";

const footerLinks = {
  Product: ["Discover", "Stories", "Features", "Safety", "Premium"],
  Company: ["About Us", "Blog", "Careers", "Press", "Ethics Statement"],
  Support: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export function Footer() {
  return (
    <footer
      style={{ background: "linear-gradient(150deg, #0D0B2B 0%, #1F0B35 100%)" }}
      className="border-t border-white/10"
    >
      {/* CTA Band */}
      <div
        className="py-20 text-center px-6"
        style={{ background: "linear-gradient(135deg, #C2185B 0%, #880E4F 50%, #6A1B9A 100%)" }}
      >
        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase mb-4">Become First</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-2xl mx-auto">
          Ready to find your soul&apos;s counterpart?
        </h2>
        <p className="mt-4 text-white/70 max-w-md mx-auto text-base">
          Join a community of thousands who have found authentic connection. Your journey to a deeper, intentional relationship starts here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3.5 rounded-full bg-white text-rose-700 text-sm font-bold hover:bg-rose-50 transition-all hover:scale-105 shadow-xl">
            Create Your Account
          </button>
          <button className="px-8 py-3.5 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-all">
            Explore Stories
          </button>
        </div>
        <p className="mt-6 text-xs text-white/40">No credit card required. Set up in 60 seconds.</p>
      </div>

      {/* Footer links */}
      <div className="mx-auto max-w-7xl px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand column */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg">
              <Heart className="h-4.5 w-4.5 text-white fill-white" strokeWidth={0} />
            </div>
            <span className="text-xl font-bold text-white">
              Soul<span className="text-rose-400">Match</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-white/45 leading-relaxed max-w-xs">
            Creating a space for genuine emotional connection. We prioritise safety, authenticity and lasting love over addictive, superficial swiping.
          </p>
          {/* Social links */}
          <div className="mt-6 flex items-center gap-3">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <button
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category}>
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">{category}</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter */}
      <div className="border-t border-white/10 mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-white/80">Stay in the loop</p>
          <p className="text-xs text-white/40 mt-0.5">Dating tips, success stories, and new features.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 md:w-64 rounded-full border border-white/15 bg-white/8 px-5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-rose-400 transition-colors"
          />
          <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold hover:from-rose-400 hover:to-pink-500 transition-all shrink-0">
            Subscribe <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-5 text-center">
        <p className="text-xs text-white/25">© {new Date().getFullYear()} Connect Love. All rights reserved.</p>
      </div>
    </footer>
  );
}
