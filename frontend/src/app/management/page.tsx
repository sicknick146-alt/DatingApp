"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldAlert, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function ManagementNavbar() {
  return (
    <header className="w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm z-50">
      <div className="mx-auto flex h-18 max-w-7xl items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-shadow">
            <Heart className="h-4.5 w-4.5 text-white fill-white" strokeWidth={0} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Connect<span className="text-rose-500">Love</span>
          </span>
        </Link>
      </div>
    </header>
  );
}

function ManagementFooter() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-6">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-sm text-slate-500">
          © 2026 Connect Love. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function ManagementPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ManagementNavbar />

      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden pt-12 pb-16">
        {/* Background gradient matching homepage hero style */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100/40 via-slate-50 to-white" />
        
        <div className="container px-4 md:px-6 flex flex-col items-center text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm font-medium text-rose-600 mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-rose-500 mr-2 animate-pulse"></span>
            Management Portal
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-slate-900 mb-6"
          >
            App Background <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Management</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600 mb-10 max-w-2xl"
          >
            Select your role to access the management dashboard and control application settings, users, and matches.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid sm:grid-cols-2 gap-6 w-full max-w-xl"
          >
            {/* Admin Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Admin</h3>
              <p className="text-sm text-slate-500 mb-6 text-center">
                Manage user profiles, review reports, and handle basic support tickets.
              </p>
              <Link href="/admin" className="w-full mt-auto">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 shadow-lg shadow-blue-600/20">
                  Login as Admin
                </Button>
              </Link>
            </div>

            {/* Super Admin Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Super Admin</h3>
              <p className="text-sm text-slate-500 mb-6 text-center">
                Full system access. Manage admins, global settings, and database configurations.
              </p>
              <Link href="/super-admin" className="w-full mt-auto">
                <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-90 text-white rounded-xl py-6 shadow-lg shadow-rose-500/20 border-0">
                  Login as Super Admin
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <ManagementFooter />
    </div>
  );
}
