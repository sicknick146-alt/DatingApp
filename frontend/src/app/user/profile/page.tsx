"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BadgeCheck, Camera, Eye, Heart as HeartIcon, LogOut, Sparkles, Loader2, CheckCircle2, AlertCircle,
} from "lucide-react";
import { logout, getToken, clearToken } from "@/lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Fields that count toward profile completion (in order of weight)
const COMPLETION_FIELDS = [
  "name", "dob", "gender", "profession", "height", "city", "bio", "interests", "personality", "hobbies",
] as const;

type ProfileField = typeof COMPLETION_FIELDS[number];

interface UserProfile {
  id: number;
  name: string;
  email: string;
  dob: string;
  gender: string;
  profession: string;
  height: string;
  city: string;
  bio: string;
  interests: string;   // comma-separated
  personality: string; // comma-separated
  hobbies: string;     // comma-separated
  avatarUrl: string;
  plan: string;
  isVerified: boolean;
  onboardingCompleted: boolean;
}

function calcCompletion(p: Partial<UserProfile>): number {
  const filled = COMPLETION_FIELDS.filter((f) => {
    const v = Reflect.get(p, f);
    return v && String(v).trim().length > 0;
  }).length;
  return Math.round((filled / COMPLETION_FIELDS.length) * 100);
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [savedCompletion, setSavedCompletion] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── localStorage key for avatar cache ───────────────────────────────────
  const AVATAR_KEY = "cl_avatar_url";

  // ── Fetch profile on mount ───────────────────────────────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/";
      return;
    }

    // Load cached avatar immediately so UI doesn't flash
    const cachedAvatar = localStorage.getItem(AVATAR_KEY);

    fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          clearToken();
          window.location.href = "/";
          return null;
        }
        if (!r.ok) throw new Error("Failed to load profile");
        return r.json();
      })
      .then((data) => {
        if (data) {
          // Prefer server avatarUrl, fall back to localStorage cache
          const resolvedAvatar = data.avatarUrl || cachedAvatar || "";
          const merged = { ...data, avatarUrl: resolvedAvatar };
          setProfile(merged);
          setSavedCompletion(calcCompletion(merged));
          // Keep localStorage in sync with server
          if (data.avatarUrl) localStorage.setItem(AVATAR_KEY, data.avatarUrl);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const set = (key: keyof UserProfile, val: string) => {
    setProfile((p) => ({ ...p, [key]: val }));
    setSaveMsg(null);
  };


  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    const token = getToken();
    if (!token) { clearToken(); window.location.href = "/"; return; }
    try {
      // Do NOT send avatarUrl — it is auto-uploaded separately when the photo is picked.
      // Sending a large base64 string here could exceed request body limits.
      const updatePayload = {
        name: profile.name,
        dob: profile.dob,
        gender: profile.gender,
        profession: profile.profession,
        height: profile.height,
        city: profile.city,
        interests: profile.interests,
        personality: profile.personality,
        hobbies: profile.hobbies,
        bio: profile.bio,
      };

      const res = await fetch(`${API}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });
      if (res.status === 401) { clearToken(); window.location.href = "/"; return; }
      if (!res.ok) throw new Error("Save failed");
      const updated = await res.json();

      // Preserve the current avatar — server response may not echo the full base64 back
      const currentAvatar = profile.avatarUrl || localStorage.getItem(AVATAR_KEY) || "";
      const merged = { ...updated, avatarUrl: updated.avatarUrl || currentAvatar };
      setProfile(merged);
      if (merged.avatarUrl) localStorage.setItem(AVATAR_KEY, merged.avatarUrl);

      setSavedCompletion(calcCompletion(merged));
      setSaveMsg({ ok: true, text: "Profile saved successfully!" });
    } catch {
      setSaveMsg({ ok: false, text: "Could not save. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 4000);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Convert file → base64, save to localStorage, and auto-upload to backend
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      if (!base64) return;

      // 1. Update UI immediately
      setProfile((p) => ({ ...p, avatarUrl: base64 }));

      // 2. Persist to localStorage so it survives page navigation
      localStorage.setItem(AVATAR_KEY, base64);

      // 3. Auto-upload the new avatar to the backend
      const token = getToken();
      if (token) {
        setPhotoSaving(true);
        try {
          const res = await fetch(`${API}/users/me`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ avatarUrl: base64 }),
          });
          if (res.ok) {
            const updated = await res.json();
            // Sync back from server in case it transforms the URL
            if (updated.avatarUrl) {
              setProfile((p) => ({ ...p, avatarUrl: updated.avatarUrl }));
              localStorage.setItem(AVATAR_KEY, updated.avatarUrl);
            }
          }
        } catch {
          // Silent fail — photo is still cached in localStorage
        } finally {
          setPhotoSaving(false);
        }
      }
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  // Live completion (updates as user types) vs saved completion (updates after Save)
  const liveCompletion = calcCompletion(profile);
  const isEmpty = (key: ProfileField) => !Reflect.get(profile, key)?.toString().trim();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* ── Main profile card ───────────────────────────────────────────── */}
      <section className="space-y-6 rounded-2xl bg-white p-6 shadow-lg" style={{ border: "1px solid rgba(236,72,153,0.15)" }}>
        {/* Hidden file input for photo upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />

        {/* Header */}
        <header className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
            <Avatar className="h-20 w-20" style={{ border: "2px solid rgba(236,72,153,0.3)" }}>
              <AvatarImage src={profile.avatarUrl || undefined} />
              <AvatarFallback
                className="text-white text-sm font-bold"
                style={{ background: "linear-gradient(135deg,#f43f5e,#ec4899)" }}
              >
                {profile.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              {photoSaving
                ? <Loader2 className="h-5 w-5 text-white animate-spin" />
                : <Camera className="h-5 w-5 text-white" />}
            </div>
            {/* Saving ring pulse */}
            {photoSaving && (
              <span className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping opacity-50" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-800">
                {profile.name || "Your Name"}
                {profile.dob ? `, ${new Date().getFullYear() - new Date(profile.dob).getFullYear()}` : ""}
              </h1>
              {profile.isVerified && <BadgeCheck className="h-5 w-5 text-emerald-400" />}
            </div>
            <p className="text-sm text-slate-500 capitalize">
              {profile.isVerified ? "Verified · " : ""}{profile.plan ?? "free"} member
            </p>
          </div>
          <Button
            variant="outline"
            className="ml-auto shrink-0 border-rose-200 text-slate-600 hover:bg-rose-50 hover:text-rose-500"
            onClick={handlePhotoClick}
            disabled={photoSaving}
          >
            {photoSaving
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving photo…</>
              : <><Camera className="mr-2 h-4 w-4" />Edit photos</>}
          </Button>
        </header>

        {/* Save feedback */}
        {saveMsg && (
          <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm border ${
            saveMsg.ok
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}>
            {saveMsg.ok
              ? <CheckCircle2 className="h-4 w-4 shrink-0" />
              : <AlertCircle className="h-4 w-4 shrink-0" />}
            {saveMsg.text}
          </div>
        )}

        {/* Form fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <RequiredField
            label="Display name"
            value={profile.name ?? ""}
            required={isEmpty("name")}
            onChange={(v) => set("name", v)}
          />
          <RequiredField
            label="Date of birth"
            type="date"
            value={profile.dob ?? ""}
            required={isEmpty("dob")}
            onChange={(v) => set("dob", v)}
          />
          <div className="space-y-2">
            <Label className={isEmpty("gender") ? "text-rose-500" : "text-slate-600"}>
              Gender {isEmpty("gender") && <span className="text-xs font-normal text-rose-400">(required)</span>}
            </Label>
            <select
              value={profile.gender ?? ""}
              onChange={(e) => set("gender", e.target.value)}
              className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white text-slate-800 outline-none transition-all focus:ring-2 ${
                isEmpty("gender")
                  ? "border-rose-400 focus:ring-rose-300 focus:border-rose-500"
                  : "border-slate-200 focus:ring-rose-200 focus:border-rose-300"
              }`}
            >
              <option value="" className="bg-white text-slate-800">Select gender</option>
              <option value="male" className="bg-white text-slate-800">Male</option>
              <option value="female" className="bg-white text-slate-800">Female</option>
              <option value="non-binary" className="bg-white text-slate-800">Non-binary</option>
              <option value="prefer-not" className="bg-white text-slate-800">Prefer not to say</option>
            </select>
          </div>
          <RequiredField
            label="Profession"
            placeholder="e.g. Software Engineer"
            value={profile.profession ?? ""}
            required={isEmpty("profession")}
            onChange={(v) => set("profession", v)}
          />
          <RequiredField
            label="Height"
            placeholder={`e.g. 5'10"`}
            value={profile.height ?? ""}
            required={isEmpty("height")}
            onChange={(v) => set("height", v)}
          />
          <RequiredField
            label="Current city"
            placeholder="e.g. Brooklyn, NY"
            value={profile.city ?? ""}
            required={isEmpty("city")}
            onChange={(v) => set("city", v)}
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label className={isEmpty("bio") ? "text-rose-500" : "text-slate-600"}>
            Bio (max 250 chars) {isEmpty("bio") && <span className="text-xs font-normal text-rose-400">(required)</span>}
          </Label>
          <Textarea
            value={profile.bio ?? ""}
            onChange={(e) => set("bio", e.target.value)}
            maxLength={250}
            placeholder="Tell potential matches about yourself…"
            className={`min-h-[100px] bg-white text-slate-800 placeholder:text-slate-400 border transition-all ${
              isEmpty("bio") ? "border-rose-400 focus:ring-rose-300" : "border-slate-200 focus:ring-rose-200"
            }`}
          />
          <p className="text-right text-xs text-slate-500">{(profile.bio ?? "").length}/250</p>
        </div>

        {/* Personality tags */}
        <TagField
          label="Personality"
          hint="(single words, comma-separated)"
          value={profile.personality ?? ""}
          required={isEmpty("personality")}
          color="brand"
          onChange={(v) => set("personality", v)}
        />

        {/* Interests */}
        <TagField
          label="Interests & hobbies"
          hint="(comma-separated)"
          value={profile.interests ?? ""}
          required={isEmpty("interests")}
          color="blue"
          onChange={(v) => set("interests", v)}
        />

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4" style={{ borderColor: "rgba(236,72,153,0.15)" }}>
          <div className="flex gap-2">
            <Button variant="outline" className="text-rose-500 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:text-rose-600">
              Delete account
            </Button>
            <Button
              id="profile-logout-btn"
              variant="outline"
              className="gap-2 text-slate-600 border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-700 transition-colors"
              onClick={() => logout("/")}
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>
          <Button
            className="bg-gradient-to-r from-rose-500 to-pink-600 text-white gap-2 border-0"
            onClick={handleSave}
            disabled={saving}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </section>

      {/* ── Right sidebar ──────────────────────────────────────────────── */}
      <aside className="space-y-4">
        {/* Profile completion meter */}
        <div className="rounded-2xl bg-white p-5 shadow-lg" style={{ border: "1px solid rgba(236,72,153,0.15)" }}>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border border-white/10">
              <AvatarImage src={profile.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"} />
              <AvatarFallback className="bg-slate-800 text-white">{profile.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-800">Your Profile</p>
              <p className={`text-sm font-bold ${savedCompletion >= 80 ? "text-emerald-400" : savedCompletion >= 50 ? "text-amber-400" : "text-rose-400"}`}>
                {savedCompletion}% Complete
              </p>
            </div>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full" style={{ background: "rgba(236,72,153,0.1)" }}>
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                savedCompletion >= 80
                  ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                  : savedCompletion >= 50
                  ? "bg-gradient-to-r from-amber-400 to-amber-500"
                  : "bg-gradient-to-r from-rose-400 to-pink-500"
              }`}
              style={{ width: `${savedCompletion}%` }}
            />
          </div>
          {savedCompletion < 100 && (
            <p className="mt-3 text-xs text-slate-500">
              {100 - savedCompletion}% to go — complete your profile to get more matches!
            </p>
          )}
          {/* Missing fields checklist — based on live (unsaved) data */}
          {liveCompletion < 100 && (
            <ul className="mt-4 space-y-2">
              {COMPLETION_FIELDS.filter((f) => isEmpty(f)).map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                  <span className="capitalize">{f === "dob" ? "Date of birth" : f === "bio" ? "Bio" : f}</span>
                  <span className="text-rose-500 font-medium ml-auto">missing</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Insights */}
        <div className="rounded-2xl bg-white p-5 shadow-lg" style={{ border: "1px solid rgba(236,72,153,0.15)" }}>
          <h3 className="text-base font-semibold text-slate-800">Profile insights</h3>
          <div className="mt-4 space-y-3">
            <Stat icon={Eye} label="Profile views (7d)" value="248" />
            <Stat icon={HeartIcon} label="Likes received" value="36" />
            <Stat icon={Sparkles} label="Compatibility avg." value="82%" />
          </div>
        </div>

        {/* Premium tip */}
        <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #fff0f3, #fce7f3)", border: "1px solid rgba(236,72,153,0.25)" }}>
          <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-rose-400" /> Premium tip
          </p>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Add a short video to your profile — premium users with video get 3.2× more matches.
          </p>
          <Link href="/user/premium">
            <Button className="mt-4 w-full text-white rounded-lg h-9 text-xs" style={{ background: "linear-gradient(135deg,#f43f5e,#ec4899)" }}>
              Upgrade to Premium
            </Button>
          </Link>
        </div>
      </aside>
    </div>
  );
}

// ── Helper components ────────────────────────────────────────────────────────

function RequiredField({
  label, value, required, onChange, type = "text", placeholder,
}: {
  label: string;
  value: string;
  required: boolean;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className={required ? "text-rose-500" : "text-slate-600"}>
        {label}{" "}
        {required && <span className="text-xs font-normal text-rose-400">(required)</span>}
      </Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-white text-slate-800 placeholder:text-slate-400 transition-all ${
          required ? "border-rose-400 focus:ring-rose-300" : "border-slate-200 focus:ring-rose-200"
        }`}
      />
    </div>
  );
}

function TagField({
  label, hint, value, required, color, onChange,
}: {
  label: string;
  hint: string;
  value: string;
  required: boolean;
  color: "brand" | "blue";
  onChange: (v: string) => void;
}) {
  const tags = value.split(",").map((t) => t.trim()).filter(Boolean);
  const colorClass = color === "brand"
    ? "bg-rose-50 border border-rose-200 text-rose-500"
    : "bg-blue-50 border border-blue-200 text-blue-500";

  return (
    <div className="space-y-2">
      <Label className={required ? "text-rose-500" : "text-slate-600"}>
        {label} <span className="text-xs font-normal text-slate-500">{hint}</span>
        {required && <span className="ml-1 text-xs font-normal text-rose-400">(required)</span>}
      </Label>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((t) => (
            <span key={t} className={`rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}>
              {t}
            </span>
          ))}
        </div>
      )}
      <Input
        value={value}
        placeholder={`e.g. ${label === "Personality" ? "Curious, Calm, Witty" : "Coffee, Hiking, Design"}`}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-white text-slate-800 placeholder:text-slate-400 transition-all ${
          required ? "border-rose-400 focus:ring-rose-300" : "border-slate-200 focus:ring-rose-200"
        }`}
      />
    </div>
  );
}

function Stat({
  icon: Icon, label, value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-slate-400">
        <Icon className="h-4 w-4 text-slate-500" /> {label}
      </span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}
