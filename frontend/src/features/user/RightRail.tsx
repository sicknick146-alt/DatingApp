"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { matches as mockMatches, discoverProfiles } from "@/lib/mock-data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { getToken } from "@/lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const COMPLETION_FIELDS = [
  "name", "dob", "gender", "profession", "height", "city", "bio", "interests", "personality", "hobbies",
] as const;

function calcCompletion(p: any): number {
  const filled = COMPLETION_FIELDS.filter((f) => {
    const v = p[f];
    return v && String(v).trim().length > 0;
  }).length;
  return Math.round((filled / COMPLETION_FIELDS.length) * 100);
}

const allProfiles = [...mockMatches, ...discoverProfiles].reduce((acc, profile) => {
  acc[profile.id] = profile;
  return acc;
}, {} as Record<string, any>);

type DBMatch = { id: string; userId: string; targetProfileId: string; status: string };

export function RightRail() {
  const [completion, setCompletion] = useState(85);
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop");
  const [recentMatches, setRecentMatches] = useState<any[]>([]);

  useEffect(() => {
    const token = getToken();
    
    // Fetch User Profile
    if (token) {
      fetch(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          return null;
        })
        .then((data) => {
          if (data) {
            setCompletion(calcCompletion(data));
            if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
            else {
              const cached = localStorage.getItem("cl_avatar_url");
              if (cached) setAvatarUrl(cached);
            }
          }
        })
        .catch(() => {});
    }

    // Fetch matches from DB
    fetch(`${API}/matches`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const matched = data.filter((m: DBMatch) => m.status === "MATCHED");
          // deduplicate and map
          const displayMatches = Array.from(new Map(matched.map(m => [m.targetProfileId, m])).values()).map(m => {
            const profile = allProfiles[m.targetProfileId] || {};
            return {
              id: m.targetProfileId,
              name: profile.name || "Unknown",
              photo: profile.photo,
            };
          });
          setRecentMatches(displayMatches);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Profile Completion */}
      <div
        className="rounded-2xl bg-white p-5 shadow-lg"
        style={{ border: "1px solid rgba(236,72,153,0.15)" }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12" style={{ border: "2px solid rgba(236,72,153,0.3)" }}>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback
              className="text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg,#f43f5e,#ec4899)" }}
            >
              You
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-semibold text-slate-800">Your Profile</p>
            <p className="text-sm font-medium text-rose-500">{completion}% Complete</p>
          </div>
        </div>
        <Progress value={completion} className="mt-4 h-2" />
      </div>

      {/* Recent Matches */}
      <div
        className="flex-1 rounded-2xl bg-white p-5 shadow-lg flex flex-col"
        style={{ border: "1px solid rgba(236,72,153,0.15)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Recent Matches</h3>
          <Link
            href="/user/matches"
            className="text-sm font-medium text-rose-500 hover:text-rose-600 hover:underline"
          >
            See all
          </Link>
        </div>
        <ul className="mt-4 space-y-4 flex-1">
          {recentMatches.length > 0 ? recentMatches.map((m) => (
            <li key={m.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-11 w-11" style={{ border: "2px solid rgba(236,72,153,0.2)" }}>
                  <AvatarImage src={m.photo} />
                  <AvatarFallback
                    className="text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg,#f43f5e,#ec4899)" }}
                  >
                    {m.name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {m.name}
                </p>
                <Link href={`/user/messages?id=${m.id}`} className="text-xs text-rose-500 hover:underline block mt-0.5">
                  Message
                </Link>
              </div>
            </li>
          )) : (
            <p className="text-sm text-slate-400 mt-2">No recent matches yet.</p>
          )}
        </ul>

        {/* Upgrade Ad */}
        <div
          className="mt-6 rounded-xl p-4 text-center"
          style={{
            background: "linear-gradient(135deg, #fff0f3, #fce7f3)",
            border: "1px solid rgba(236,72,153,0.25)",
          }}
        >
          <Sparkles className="h-6 w-6 text-rose-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800 mb-1">Stand out with Premium</h4>
          <p className="text-xs text-slate-500 mb-3">See who liked you and get more matches.</p>
          <Link href="/user/premium" className="block">
            <Button
              className="w-full text-white h-9 text-xs rounded-lg"
              style={{ background: "linear-gradient(135deg,#f43f5e,#ec4899)" }}
            >
              Upgrade Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
