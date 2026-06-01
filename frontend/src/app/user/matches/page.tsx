"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { matches as mockMatches, discoverProfiles } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Ban, Clock, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner"; 
import { cn } from "@/lib/utils";

// Combine all possible profiles for easy lookup by ID
const allProfiles = [...mockMatches, ...discoverProfiles].reduce((acc, profile) => {
  acc[profile.id] = profile;
  return acc;
}, {} as Record<string, any>);

type MatchStatus = "PENDING" | "MATCHED" | "BLOCKED";
type DBMatch = { id: string; userId: string; targetProfileId: string; status: MatchStatus };

export default function MatchesDashboard() {
  const [dbMatches, setDbMatches] = useState<DBMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const res = await fetch("http://localhost:3001/matches");
      const data = await res.json();
      
      // Auto-seed if database is completely empty (for demo purposes)
      if (data.length === 0) {
        await seedDatabase();
      } else {
        setDbMatches(data.filter((m: DBMatch) => m.status !== "BLOCKED"));
      }
    } catch (error) {
      console.error("Failed to fetch matches", error);
    } finally {
      setIsLoading(false);
    }
  };

  const seedDatabase = async () => {
    const seed = [
      { targetProfileId: "m1", status: "MATCHED" },
      { targetProfileId: "m2", status: "MATCHED" },
      { targetProfileId: "m3", status: "MATCHED" },
      { targetProfileId: "p1", status: "PENDING" }, // From discover
    ];
    for (const item of seed) {
      if (item.status === "PENDING") {
        await fetch("http://localhost:3001/matches/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "me", targetProfileId: item.targetProfileId }),
        });
      } else {
        // Create as pending then update to matched
        const res = await fetch("http://localhost:3001/matches/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "me", targetProfileId: item.targetProfileId }),
        });
        const created = await res.json();
        await fetch(`http://localhost:3001/matches/${created.id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "MATCHED" }),
        });
      }
    }
    // Fetch again after seeding
    const res = await fetch("http://localhost:3001/matches");
    const data = await res.json();
    setDbMatches(data.filter((m: DBMatch) => m.status !== "BLOCKED"));
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleBlock = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/matches/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "BLOCKED" }),
      });
      // Update local state with an exit animation (optimistic update)
      setDbMatches(prev => prev.filter(m => m.id !== id));
      toast.success("User blocked successfully");
    } catch (error) {
      console.error("Failed to block user", error);
    }
  };

  const simulateNewMatch = async () => {
    // Find a pending match
    const pendingMatch = pending.find(m => m.status === "PENDING");
    if (!pendingMatch) {
      toast.error("No pending requests to match with!");
      return;
    }
    
    try {
      await fetch(`http://localhost:3001/matches/${pendingMatch.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "MATCHED" }),
      });
      fetchMatches();
      const profile = allProfiles[pendingMatch.targetProfileId];
      toast.success(`It's a Match! You and ${profile?.name || "them"} liked each other.`);
    } catch (error) {
      console.error("Failed to simulate match", error);
    }
  };

  const active = dbMatches.filter(m => m.status === "MATCHED");
  const pending = dbMatches.filter(m => m.status === "PENDING");

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading matches...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Your Matches</h1>
          <p className="text-sm text-muted-foreground">
            Manage your active conversations and pending likes.
          </p>
        </div>
        
        <Button 
          onClick={simulateNewMatch}
          variant="outline" 
          className="bg-[color:var(--brand)]/10 text-[color:var(--brand)] border-[color:var(--brand)]/20 hover:bg-[color:var(--brand)]/20"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Simulate Match Success
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6 grid w-full max-w-[400px] grid-cols-2 p-1 bg-muted/50 rounded-xl">
          <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[color:var(--brand)] data-[state=active]:shadow-sm transition-all">
            Active Matches ({active.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[color:var(--brand)] data-[state=active]:shadow-sm transition-all">
            Pending Requests ({pending.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">You have {active.length} active matches. Say hello!</p>
          </div>
          {active.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
              No active matches yet. Keep discovering!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((m) => {
                const profile = allProfiles[m.targetProfileId];
                if (!profile) return null;
                
                return (
                  <div key={m.id} className="rounded-2xl bg-card p-5 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={profile.photo} />
                          <AvatarFallback>{profile.name[0]}</AvatarFallback>
                        </Avatar>
                        {profile.online && <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-500" />}
                      </div>
                      <div>
                        <p className="text-base font-semibold">{profile.name}, {profile.age}</p>
                        <p className="text-xs text-muted-foreground">Matched recently</p>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{profile.lastMessage || "No messages yet."}</p>
                    <div className="mt-4 flex gap-2">
                      <Link href={`/user/messages?id=${m.targetProfileId}`} className="flex-1">
                        <Button className="w-full bg-[color:var(--brand)] hover:bg-[color:var(--brand)]/90 text-white">
                          <MessageSquare className="mr-2 h-4 w-4" /> Message
                        </Button>
                      </Link>
                      <Button onClick={() => handleBlock(m.id)} variant="outline" size="icon" className="hover:text-red-500 hover:border-red-500 transition-colors">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Profiles you liked who haven't liked you back yet ({pending.length}).</p>
          </div>
          {pending.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
              You haven't liked anyone recently. Go to Discover to find matches!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pending.map((m) => {
                const profile = allProfiles[m.targetProfileId];
                if (!profile) return null;
                
                return (
                  <div key={m.id} className="rounded-2xl bg-card p-5 shadow-sm opacity-80 transition-all hover:opacity-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-14 w-14 grayscale-[30%]">
                          <AvatarImage src={profile.photo} />
                          <AvatarFallback>{profile.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="text-base font-semibold">{profile.name}, {profile.age}</p>
                        <p className="text-xs text-muted-foreground">Liked recently</p>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{profile.bio || "Waiting for them to like you back."}</p>
                    <div className="mt-4 flex gap-2">
                      <div className="flex-1 flex items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4 opacity-50" /> Pending Approval
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
