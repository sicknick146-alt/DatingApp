"use client";

import { useState, useMemo } from "react";
import { FiltersPanel, defaultFilters, type DiscoverFilters } from "@/features/user/FiltersPanel";
import { ProfileCard } from "@/features/user/ProfileCard";
import { RightRail } from "@/features/user/RightRail";
import { discoverProfiles, type Profile } from "@/lib/mock-data";

function applyFilters(profiles: Profile[], filters: DiscoverFilters): Profile[] {
  return profiles.filter((p) => {
    if (p.age < filters.ageMin || p.age > filters.ageMax) return false;
    if (p.distanceMi > filters.maxDistance) return false;
    if (filters.verifiedOnly && !p.verified) return false;
    if (filters.interests.length > 0 && !filters.interests.some((i) => p.interests.includes(i))) return false;
    if (filters.goals.length > 0 && !filters.goals.includes(p.goals)) return false;
    return true;
  });
}

export default function Discover() {
  const [filters, setFilters] = useState<DiscoverFilters>(defaultFilters);
  const filtered = useMemo(() => applyFilters(discoverProfiles, filters), [filters]);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr_320px]">
      <FiltersPanel filters={filters} onChange={setFilters} />
      <div className="flex items-start justify-center pt-2">
        <ProfileCard profiles={filtered} />
      </div>
      <RightRail />
    </div>
  );
}
