import * as React from "react";
import { useMemo, useState } from "react";
import { Calendar, MapPin, Heart, Target, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { discoverProfiles } from "@/lib/mock-data";

export interface DiscoverFilters {
  ageMin: number;
  ageMax: number;
  maxDistance: number;
  interests: string[];
  goals: string[];
  verifiedOnly: boolean;
}

export const defaultFilters: DiscoverFilters = {
  ageMin: 18,
  ageMax: 60,
  maxDistance: 20,
  interests: [],
  goals: [],
  verifiedOnly: false,
};

const filtersMeta = [
  { id: "age", label: "Age Range", icon: Calendar },
  { id: "distance", label: "Distance", icon: MapPin },
  { id: "interests", label: "Interests", icon: Heart },
  { id: "goals", label: "Relationship Goals", icon: Target },
  { id: "verified", label: "Verified Only", icon: BadgeCheck },
];

interface FiltersPanelProps {
  filters: DiscoverFilters;
  onChange: (next: DiscoverFilters) => void;
}

export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  const [active, setActive] = useState("age");

  const allInterests = useMemo(
    () => Array.from(new Set(discoverProfiles.flatMap((p) => p.interests))).sort(),
    [],
  );
  const allGoals = useMemo(
    () => Array.from(new Set(discoverProfiles.map((p) => p.goals))).sort(),
    [],
  );

  const update = <K extends keyof DiscoverFilters>(key: K, value: DiscoverFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  return (
    <aside className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-lg" style={{ border: "1px solid rgba(236,72,153,0.15)" }}>
      <div className="border-b pb-4" style={{ borderColor: "rgba(236,72,153,0.15)" }}>
        <h2 className="text-xl font-semibold text-slate-800">Filters</h2>
        <p className="mt-1 text-sm text-slate-400">Refine your matches</p>
      </div>

      <nav className="mt-4 space-y-1">
        {filtersMeta.map((f) => {
          const Icon = f.icon;
          const isActive = active === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-rose-50 text-rose-500"
                  : "text-slate-500 hover:bg-pink-50 hover:text-rose-400",
              )}
            >
              <Icon className="h-4 w-4" />
              {f.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 flex-1 rounded-xl p-4" style={{ background: "rgba(253,242,248,0.6)", border: "1px solid rgba(236,72,153,0.1)" }}>
        {active === "age" && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-700">Age Range</p>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>{filters.ageMin} yrs</span>
              <span className="font-semibold text-rose-500">{filters.ageMax} yrs</span>
            </div>
            <Slider
              value={[filters.ageMax]}
              onValueChange={(v: number[]) => update("ageMax", v[0])}
              min={18}
              max={60}
              step={1}
            />
            <p className="text-xs text-slate-400">Showing ages {filters.ageMin}–{filters.ageMax}</p>
          </div>
        )}

        {active === "distance" && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-700">Max Distance</p>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>1 mi</span>
              <span className="font-semibold text-rose-500">{filters.maxDistance} mi</span>
              <span>20 mi</span>
            </div>
            <Slider
              value={[filters.maxDistance]}
              onValueChange={(v: number[]) => update("maxDistance", v[0])}
              min={1}
              max={20}
              step={1}
            />
          </div>
        )}

        {active === "interests" && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Select Interests</p>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => (
                <label
                  key={interest}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    filters.interests.includes(interest)
                      ? "border-rose-500 bg-rose-500/20 text-rose-400"
                      : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10",
                  )}
                >
                  <Checkbox
                    checked={filters.interests.includes(interest)}
                    onCheckedChange={() => update("interests", toggleArray(filters.interests, interest))}
                    className="sr-only"
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>
        )}

        {active === "goals" && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Relationship Goals</p>
            <div className="flex flex-wrap gap-2">
              {allGoals.map((goal) => (
                <label
                  key={goal}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    filters.goals.includes(goal)
                      ? "border-pink-500 bg-pink-500/20 text-pink-400"
                      : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10",
                  )}
                >
                  <Checkbox
                    checked={filters.goals.includes(goal)}
                    onCheckedChange={() => update("goals", toggleArray(filters.goals, goal))}
                    className="sr-only"
                  />
                  {goal}
                </label>
              ))}
            </div>
          </div>
        )}

        {active === "verified" && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Show verified profiles only</span>
            <Switch
              checked={filters.verifiedOnly}
              onCheckedChange={(v: boolean) => update("verifiedOnly", v)}
            />
          </div>
        )}
      </div>

      <Button
        onClick={() => onChange(defaultFilters)}
        variant="outline"
        className="mt-4 h-11 w-full bg-white border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-medium"
      >
        Reset Filters
      </Button>
    </aside>
  );
}
