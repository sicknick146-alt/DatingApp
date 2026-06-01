"use client";

import { useState } from "react";
import {
  Eye, MapPin, Image, Bell, Heart, ShieldCheck,
  Lock, Trash2, UserX, Download, ChevronRight,
  Moon, Globe, Smartphone,
} from "lucide-react";

interface Toggle {
  id: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultChecked?: boolean;
}

const privacyToggles: Toggle[] = [
  { id: "online",         label: "Show online status",          desc: "Let matches see when you're active.",                    icon: Eye,         defaultChecked: true  },
  { id: "distance",       label: "Show distance",               desc: "Display approximate distance on your profile.",          icon: MapPin,      defaultChecked: true  },
  { id: "photos-public",  label: "Photos visible to non-matches", desc: "Otherwise blurred until you match.",                   icon: Image,       defaultChecked: false },
  { id: "verified-only",  label: "Only show verified profiles", desc: "Hide unverified accounts from discovery.",               icon: ShieldCheck, defaultChecked: false },
];

const notifToggles: Toggle[] = [
  { id: "notif-msg",   label: "Message notifications", desc: "Push notifications for new messages.",          icon: Bell,  defaultChecked: true  },
  { id: "notif-match", label: "Match notifications",   desc: "Be notified when someone matches with you.",    icon: Heart, defaultChecked: true  },
  { id: "notif-push",  label: "Push notifications",    desc: "Receive alerts on your mobile device.",         icon: Smartphone, defaultChecked: true },
];

const appToggles: Toggle[] = [
  { id: "dark-mode",   label: "Dark mode",        desc: "Switch to a darker interface.",              icon: Moon,  defaultChecked: false },
  { id: "lang-en",     label: "Language: English", desc: "Change your app display language.",          icon: Globe, defaultChecked: true  },
];

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
        checked
          ? "bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30"
          : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function ToggleRow({ toggle }: { toggle: Toggle }) {
  const [checked, setChecked] = useState(toggle.defaultChecked ?? false);
  const Icon = toggle.icon;
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm border transition-all hover:shadow-md hover:border-rose-100 group"
      style={{ borderColor: "rgba(236, 72, 153, 0.12)" }}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
          checked
            ? "bg-gradient-to-br from-rose-500 to-pink-500 shadow-md shadow-rose-500/25 text-white"
            : "bg-rose-50 text-rose-400 group-hover:bg-rose-100"
        }`}>
          <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{toggle.label}</p>
          <p className="text-xs text-slate-400 mt-0.5">{toggle.desc}</p>
        </div>
      </div>
      <ToggleSwitch checked={checked} onChange={() => setChecked((v) => !v)} />
    </div>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="px-1">
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function DangerRow({ label, desc, icon: Icon, color = "red" }: { label: string; desc: string; icon: React.ComponentType<{ className?: string }>; color?: string }) {
  const colorMap: Record<string, string> = {
    red:    "text-red-500   bg-red-50   hover:bg-red-100   border-red-100",
    orange: "text-orange-500 bg-orange-50 hover:bg-orange-100 border-orange-100",
    blue:   "text-blue-500  bg-blue-50  hover:bg-blue-100  border-blue-100",
  };
  const c = colorMap[color] ?? colorMap.red;
  return (
    <button className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 bg-white shadow-sm transition-all hover:shadow-md ${c}`}>
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c}`}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-slate-800">{label}</p>
          <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-300" />
    </button>
  );
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-16">
      {/* Header */}
      <div
        className="rounded-3xl p-7 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #fff0f3 0%, #fce7f3 50%, #fdf2f8 100%)", border: "1px solid rgba(236,72,153,0.15)" }}
      >
        {/* decorative circles */}
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-rose-500/10 pointer-events-none" />
        <div className="absolute right-16 -bottom-4 h-20 w-20 rounded-full bg-pink-400/10 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30">
              <Lock className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Settings &amp; Privacy</h1>
              <p className="text-sm text-slate-500">You decide what&apos;s shared and when.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Visibility */}
      <SectionCard title="Privacy & Visibility" subtitle="Control what others see on your profile.">
        {privacyToggles.map((t) => <ToggleRow key={t.id} toggle={t} />)}
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications" subtitle="Choose when and how we contact you.">
        {notifToggles.map((t) => <ToggleRow key={t.id} toggle={t} />)}
      </SectionCard>

      {/* App Preferences */}
      <SectionCard title="App Preferences" subtitle="Customize your app experience.">
        {appToggles.map((t) => <ToggleRow key={t.id} toggle={t} />)}
      </SectionCard>

      {/* Account */}
      <SectionCard title="Account" subtitle="Manage your account data and access.">
        <DangerRow
          label="Download my data"
          desc="Get a copy of your ConnectLove data."
          icon={Download}
          color="blue"
        />
        <DangerRow
          label="Deactivate account"
          desc="Temporarily pause your profile from discovery."
          icon={UserX}
          color="orange"
        />
        <DangerRow
          label="Delete account"
          desc="Permanently remove your account and all data."
          icon={Trash2}
          color="red"
        />
      </SectionCard>

      {/* Footer note */}
      <p className="text-center text-xs text-slate-400 pb-2">
        ConnectLove &bull; Privacy Policy &bull; Terms of Service
      </p>
    </div>
  );
}
