/* eslint-disable */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2, Heart, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { setToken } from "@/lib/auth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Please select a gender"),
  agreeTerms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupData = z.infer<typeof signupSchema>;

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({ open, onClose, onSwitchToLogin }: SignupModalProps) {
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupData>({ resolver: zodResolver(signupSchema) });

  const password = watch("password", "");

  const strengthChecks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data: SignupData) => {
    setError("");
    try {
      // Step 1: Register
      const regRes = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password, dob: data.dob, gender: data.gender }),
      });
      if (!regRes.ok) {
        const body = await regRes.json();
        setError(body.message || "Registration failed. Please try again.");
        return;
      }

      // Step 2: Auto-login to get token
      const loginRes = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      if (loginRes.ok) {
        const { access_token } = await loginRes.json();
        setToken(access_token);
        reset();
        onClose();
        // Redirect to profile to fill in the remaining details
        window.location.href = "/user/profile";
        return;
      }

      // Fallback: show success, let user sign in manually
      setDone(true);
      reset();
    } catch {
      setError("Cannot connect to server. Please try again.");
    }
  };


  const handleClose = () => { reset(); setError(""); setDone(false); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-br from-violet-600 to-purple-700 px-8 py-7 text-white shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Heart className="h-5 w-5 fill-white text-white" strokeWidth={0} />
                    <span className="font-bold text-lg">Connect Love</span>
                  </div>
                  <button onClick={handleClose} className="rounded-full p-1.5 hover:bg-white/20 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="mt-4 text-2xl font-bold">Create your account ✨</h2>
                <p className="mt-1 text-white/75 text-sm">Start your journey to meaningful connection</p>
              </div>

              {/* Body */}
              <div className="px-8 py-6 overflow-y-auto">
                {done ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-800">You&apos;re in! 🎉</h3>
                    <p className="mt-2 text-sm text-slate-500">Account created successfully. You can now sign in and start discovering.</p>
                    <button
                      onClick={() => { handleClose(); onSwitchToLogin(); }}
                      className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm"
                    >
                      Sign In Now
                    </button>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-600">{error}</div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                          <input
                            name={register("name").name}
                            onChange={register("name").onChange}
                            onBlur={register("name").onBlur}
                            ref={register("name").ref}
                            id="signup-name"
                            placeholder="Jane Doe"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                          />
                          {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                          <input
                            name={register("dob").name}
                            onChange={register("dob").onChange}
                            onBlur={register("dob").onBlur}
                            ref={register("dob").ref}
                            id="signup-dob"
                            type="date"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                          />
                          {errors.dob && <p className="mt-1 text-xs text-rose-500">{errors.dob.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                        <input
                          name={register("email").name}
                          onChange={register("email").onChange}
                          onBlur={register("email").onBlur}
                          ref={register("email").ref}
                          id="signup-email"
                          type="email"
                          placeholder="you@email.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                        />
                        {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                        <select
                          name={register("gender").name}
                          onChange={register("gender").onChange}
                          onBlur={register("gender").onBlur}
                          ref={register("gender").ref}
                          id="signup-gender"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                          <option value="prefer-not">Prefer not to say</option>
                        </select>
                        {errors.gender && <p className="mt-1 text-xs text-rose-500">{errors.gender.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                        <div className="relative">
                          <input
                            name={register("password").name}
                            onChange={register("password").onChange}
                            onBlur={register("password").onBlur}
                            ref={register("password").ref}
                            id="signup-password"
                            type={showPass ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {/* Strength hints */}
                        {password && (
                          <div className="mt-2 flex gap-3 flex-wrap">
                            {strengthChecks.map((c) => (
                              <span key={c.label} className={`flex items-center gap-1 text-xs ${c.ok ? "text-emerald-600" : "text-slate-400"}`}>
                                <Check className={`h-3 w-3 ${c.ok ? "text-emerald-500" : "text-slate-300"}`} />
                                {c.label}
                              </span>
                            ))}
                          </div>
                        )}
                        {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                        <input
                          name={register("confirmPassword").name}
                          onChange={register("confirmPassword").onChange}
                          onBlur={register("confirmPassword").onBlur}
                          ref={register("confirmPassword").ref}
                          id="signup-confirm-password"
                          type="password"
                          placeholder="Re-enter password"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                        />
                        {errors.confirmPassword && <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword.message}</p>}
                      </div>

                      <div className="flex items-start gap-3 pt-1">
                        <input
                          name={register("agreeTerms").name}
                          onChange={register("agreeTerms").onChange}
                          onBlur={register("agreeTerms").onBlur}
                          ref={register("agreeTerms").ref}
                          id="signup-agree-terms"
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-400"
                        />
                        <label htmlFor="signup-agree-terms" className="text-xs text-slate-500 leading-relaxed">
                          I agree to the{" "}
                          <a href="#" className="text-violet-600 hover:underline font-medium">Terms of Service</a>{" "}
                          and{" "}
                          <a href="#" className="text-violet-600 hover:underline font-medium">Privacy Policy</a>. I confirm I am 18+.
                        </label>
                      </div>
                      {errors.agreeTerms && <p className="text-xs text-rose-500">{errors.agreeTerms.message}</p>}

                      <button
                        id="signup-submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-700 text-white font-semibold text-sm shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-purple-600 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                      >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Creating account…" : "Create My Account"}
                      </button>
                    </form>

                    <div className="mt-5 text-center text-sm text-slate-500">
                      Already have an account?{" "}
                      <button onClick={() => { handleClose(); onSwitchToLogin(); }} className="font-semibold text-rose-500 hover:text-rose-600">
                        Sign In
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
