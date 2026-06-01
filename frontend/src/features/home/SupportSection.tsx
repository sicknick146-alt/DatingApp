/* eslint-disable */
"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Mail, Phone, MessageSquare, ChevronDown, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type ContactData = z.infer<typeof contactSchema>;

const faqs = [
  {
    q: "Is Connect Love free to use?",
    a: "Yes! Connect Love has a free tier that lets you create a profile, browse matches, and send up to 5 messages per day. Upgrade to Gold or Platinum for unlimited access.",
  },
  {
    q: "How does the matching algorithm work?",
    a: "Our AI analyses over 80 personality dimensions, communication style, values, life goals and interests to produce compatibility scores — going far beyond looks.",
  },
  {
    q: "How do you verify member identities?",
    a: "All members go through a multi-step verification: email confirmation, phone number, and an optional government-ID check for the Verified Badge. Profile photos are also checked by AI.",
  },
  {
    q: "Can I delete my account and data?",
    a: "Absolutely. Go to Settings → Privacy → Delete Account. All your data including messages and photos is permanently removed within 48 hours, in line with GDPR.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI, Net Banking, and popular wallets (Paytm, PhonePe, Google Pay). All transactions are secured via Razorpay.",
  },
  {
    q: "How do I report someone?",
    a: "Tap the three-dot menu on any profile or message, then select 'Report'. Our moderation team reviews all reports within 2 hours and takes appropriate action.",
  },
];

export function SupportSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactData) => {
    try {
      await fetch("http://localhost:3001/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // Gracefully handle if backend isn't running yet
    }
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="support" className="bg-white py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="text-xs font-semibold tracking-widest text-rose-500 uppercase">Support</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            We&apos;re here to{" "}
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              help
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-lg mx-auto">
            Have a question or need assistance? Reach out to our team and we&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Contact channels */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {[
            { icon: Mail, label: "support@connectlove.app", detail: "Email us anytime" },
            { icon: Phone, label: "+91 98765 43210", detail: "Mon–Fri, 9am–6pm IST" },
            { icon: MessageSquare, label: "Live Chat", detail: "Response in ~5 minutes" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-50 to-pink-100">
                <c.icon className="h-4.5 w-4.5 text-rose-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{c.label}</p>
                <p className="text-xs text-slate-400">{c.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid lg:grid-cols-2 gap-16">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h3>
            {submitted ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center">
                <div className="text-4xl mb-3">✉️</div>
                <h4 className="text-lg font-semibold text-emerald-700">Message sent!</h4>
                <p className="mt-1 text-sm text-emerald-600">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                    <input
                      name={register("name").name}
                      onChange={register("name").onChange}
                      onBlur={register("name").onBlur}
                      ref={register("name").ref}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                    {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                    <input
                      name={register("email").name}
                      onChange={register("email").onChange}
                      onBlur={register("email").onBlur}
                      ref={register("email").ref}
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                    />
                    {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                  <input
                    name={register("subject").name}
                    onChange={register("subject").onChange}
                    onBlur={register("subject").onBlur}
                    ref={register("subject").ref}
                    placeholder="How can we help?"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                  {errors.subject && <p className="mt-1 text-xs text-rose-500">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                  <textarea
                    name={register("message").name}
                    onChange={register("message").onChange}
                    onBlur={register("message").onBlur}
                    ref={register("message").ref}
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                  />
                  {errors.message && <p className="mt-1 text-xs text-rose-500">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold hover:from-rose-400 hover:to-pink-500 shadow-lg shadow-rose-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isSubmitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    {faq.q}
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
