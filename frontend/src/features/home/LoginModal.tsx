/* eslint-disable */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2, Heart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { setToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginData = z.infer<typeof loginSchema>;

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export function LoginModal({ open, onClose, onSwitchToSignup }: LoginModalProps) {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginData) => {
    setError("");
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        setError(body.message || "Invalid email or password.");
        return;
      }
      const { access_token } = await res.json();
      setToken(access_token);
      reset();
      onClose();
      window.location.href = "/user/discover";
    } catch {
      setError("Cannot connect to server. Please try again.");
    }
  };


  const handleClose = () => { reset(); setError(""); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
              {/* Header gradient */}
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 px-8 py-7 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Heart className="h-5 w-5 fill-white text-white" strokeWidth={0} />
                    <span className="font-bold text-lg">Connect Love</span>
                  </div>
                  <button onClick={handleClose} className="rounded-full p-1.5 hover:bg-white/20 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="mt-4 text-2xl font-bold">Welcome back 👋</h2>
                <p className="mt-1 text-white/75 text-sm">Sign in to continue your journey</p>
              </div>

              {/* Form */}
              <div className="px-8 py-7">
                {error && (
                  <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-600">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                    <input
                      name={register("email").name}
                      onChange={register("email").onChange}
                      onBlur={register("email").onBlur}
                      ref={register("email").ref}
                      id="login-email"
                      type="email"
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                    {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-slate-700">Password</label>
                      <button type="button" className="text-xs text-rose-500 hover:text-rose-600">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <input
                        name={register("password").name}
                        onChange={register("password").onChange}
                        onBlur={register("password").onBlur}
                        ref={register("password").ref}
                        id="login-password"
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
                  </div>

                  <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm shadow-lg shadow-rose-500/30 hover:from-rose-400 hover:to-pink-500 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Signing in…" : "Sign In"}
                  </button>
                </form>

                <div className="mt-5 text-center text-sm text-slate-500">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => { handleClose(); onSwitchToSignup(); }}
                    className="font-semibold text-rose-500 hover:text-rose-600"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
