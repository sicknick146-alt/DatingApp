import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, type PanInfo } from "framer-motion";
import { MapPin, X, Heart, Star, BadgeCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/lib/mock-data";
import { getToken } from "@/lib/auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Action = "pass" | "like" | "super";

interface ProfileCardProps {
  profiles: Profile[];
}

export function ProfileCard({ profiles }: ProfileCardProps) {
  const [idx, setIdx] = useState(0);
  
  // Hold-to-view state
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailedProfile, setDetailedProfile] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [instructionVisible, setInstructionVisible] = useState(true);

  useEffect(() => {
    setIdx(0);
  }, [profiles]);

  useEffect(() => {
    // Show instruction briefly on new profile
    setInstructionVisible(true);
    const t = setTimeout(() => setInstructionVisible(false), 3000);
    return () => clearTimeout(t);
  }, [idx]);

  if (profiles.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full max-w-[460px] flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-xl" style={{ border: "1px solid rgba(236,72,153,0.15)" }}>
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-rose-50">
          <X className="h-8 w-8 text-rose-300" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800">No matches found</h3>
        <p className="mt-2 text-sm text-slate-400">Try adjusting your filters to see more people.</p>
      </div>
    );
  }

  const profile = profiles[idx % profiles.length];
  const next = profiles[(idx + 1) % profiles.length];

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [40, 160], [0, 1]);
  const nopeOpacity = useTransform(x, [-160, -40], [1, 0]);

  const advance = (action: Action) => {
    if (action === "like") toast.success(`You liked ${profile.name}`);
    if (action === "super") toast.success(`Super liked ${profile.name}`);
    if (action === "pass") toast(`Passed on ${profile.name}`);
    setIdx((i) => i + 1);
    x.set(0);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 120;
    if (info.offset.x > threshold) advance("like");
    else if (info.offset.x < -threshold) advance("pass");
  };

  const triggerSwipe = (action: Action) => {
    const target = action === "like" ? 600 : action === "pass" ? -600 : 0;
    if (action === "super") return advance("super");
    x.set(target);
    setTimeout(() => advance(action), 180);
  };

  // --- Hold-to-view interaction ---
  const fetchDetails = async () => {
    setLoadingDetails(true);
    try {
      const token = getToken();
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const res = await fetch(`${API}/users/${profile.id}/details`, { headers });
      if (res.ok) {
        const data = await res.json();
        setDetailedProfile(data);
      } else {
        // Fallback to mock profile if not found in db (e.g. p1, p2)
        setDetailedProfile({
          ...profile,
          bio: profile.bio || "No bio available.",
          height: "5'6\"",
          city: "New York",
          personality: profile.personality || [],
          hobbies: ["Photography", "Traveling", "Music", "Art", "Writing"],
        });
      }
    } catch (e) {
      setDetailedProfile({
        ...profile,
        bio: profile.bio || "No bio available.",
        height: "5'6\"",
        city: "New York",
        personality: profile.personality || [],
        hobbies: ["Photography", "Traveling", "Music", "Art"],
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const startHold = () => {
    setInstructionVisible(false);
    cancelHold();
    holdTimeoutRef.current = setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      setShowDetails(true);
      fetchDetails();
    }, 250);
  };

  const cancelHold = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (showDetails) {
      setShowDetails(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      {/* Blurred backdrop when modal is open */}
      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      {/* Stacked next card */}
      <div className="absolute inset-0 -z-10 scale-[0.96] opacity-70">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-lg">
          <img src={next.photo} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={profile.id + idx}
          drag={showDetails ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          style={{ x: showDetails ? 0 : x, rotate: showDetails ? 0 : rotate }}
          onDragEnd={onDragEnd}
          onDragStart={cancelHold}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: showDetails ? 1.05 : 1, opacity: 1, zIndex: showDetails ? 50 : 10 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative aspect-[4/5] w-full cursor-grab overflow-hidden rounded-3xl bg-slate-900 shadow-2xl active:cursor-grabbing border border-white/5"
        >
          <img src={profile.photo} alt={profile.name} draggable={false} className="h-full w-full select-none object-cover" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Instruction Toast */}
          <AnimatePresence>
            {instructionVisible && !showDetails && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md"
              >
                Hold to view full bio
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swipe labels */}
          {!showDetails && (
            <>
              <motion.div
                style={{ opacity: likeOpacity }}
                className="pointer-events-none absolute left-5 top-6 rotate-[-12deg] rounded-lg border-[3px] border-emerald-500 px-3 py-1 text-xl font-extrabold tracking-wider text-emerald-500"
              >
                LIKE
              </motion.div>
              <motion.div
                style={{ opacity: nopeOpacity }}
                className="pointer-events-none absolute right-5 top-6 rotate-[12deg] rounded-lg border-[3px] border-rose-500 px-3 py-1 text-xl font-extrabold tracking-wider text-rose-500"
              >
                NOPE
              </motion.div>
            </>
          )}

          {/* Default Overlay Content (hidden when details shown) */}
          <motion.div 
            animate={{ opacity: showDetails ? 0 : 1 }} 
            className="absolute inset-x-0 bottom-0 p-6 text-white pointer-events-none"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-3xl font-semibold tracking-tight">{profile.name}, {profile.age}</h3>
              {profile.verified && <BadgeCheck className="h-6 w-6 text-emerald-400" fill="currentColor" />}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
              <MapPin className="h-4 w-4" />
              {profile.distanceMi} mi away · {profile.profession}
            </div>
            <div className="mt-1 inline-block rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
              {profile.goals}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.interests.map((t) => (
                <span key={t} className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm border border-white/10">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Detailed Profile Overlay Modal */}
          <AnimatePresence>
            {showDetails && (
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="absolute inset-x-0 bottom-0 h-[75%] rounded-t-3xl bg-white/95 backdrop-blur-xl p-6 shadow-2xl flex flex-col text-slate-800"
              >
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300" />
                
                <div className="flex-1 overflow-y-auto pr-2 pb-10">
                  {loadingDetails && !detailedProfile ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                    </div>
                  ) : detailedProfile ? (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-slate-900">{detailedProfile.name}, {detailedProfile.age}</h2>
                          {detailedProfile.isVerified && <BadgeCheck className="h-6 w-6 text-emerald-500" fill="currentColor" />}
                        </div>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {detailedProfile.profession}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {detailedProfile.height && (
                          <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                            📏 {detailedProfile.height}
                          </div>
                        )}
                        {detailedProfile.city && (
                          <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                            📍 {detailedProfile.city}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">About Me</h4>
                        <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                          {detailedProfile.bio}
                        </p>
                      </div>

                      {detailedProfile.personality && detailedProfile.personality.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 mb-2">Personality</h4>
                          <div className="flex flex-wrap gap-2">
                            {detailedProfile.personality.map((p: string) => (
                              <span key={p} className="rounded-full bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 text-xs font-semibold">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {detailedProfile.hobbies && detailedProfile.hobbies.length > 0 && (
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 mb-2">Interests & Hobbies</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {detailedProfile.hobbies.map((h: string) => (
                              <div key={h} className="rounded-lg bg-slate-50 border border-slate-100 p-2 text-center text-xs font-medium text-slate-700">
                                {h}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-center gap-5 relative z-10">
        <button
          onClick={() => triggerSwipe("pass")}
          className="grid h-14 w-14 place-items-center rounded-full border-2 bg-white text-slate-400 shadow-md transition hover:scale-105 hover:border-rose-300 hover:text-rose-400"
          style={{ borderColor: "rgba(236,72,153,0.2)" }}
          aria-label="Pass"
        >
          <X className="h-6 w-6" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => triggerSwipe("super")}
          className="grid h-12 w-12 place-items-center rounded-full border-2 bg-white text-blue-400 shadow-md transition hover:scale-105 hover:border-blue-300"
          style={{ borderColor: "rgba(96,165,250,0.3)" }}
          aria-label="Super like"
        >
          <Star className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => triggerSwipe("like")}
          className="grid h-14 w-14 place-items-center rounded-full text-white shadow-lg shadow-rose-500/20 transition hover:scale-105 bg-gradient-to-br from-rose-500 to-pink-600"
          aria-label="Like"
        >
          <Heart className="h-6 w-6" strokeWidth={2.5} fill="currentColor" />
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Swipe right to like · Swipe left to pass
      </p>
    </div>
  );
}
