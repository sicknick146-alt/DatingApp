// Centralized mock data for Connect Love (frontend-only demo)

export type Profile = {
  id: string;
  name: string;
  age: number;
  gender: "Female" | "Male" | "Non-binary";
  distanceMi: number;
  profession: string;
  bio: string;
  personality: string[];
  interests: string[];
  photo: string;
  verified: boolean;
  online: boolean;
  goals: string;
};

const stock = (seed: string, w = 800, h = 1000) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const discoverProfiles: Profile[] = [
  {
    id: "p1", name: "Elena", age: 24, gender: "Female", distanceMi: 2,
    profession: "Architect", bio: "Lover of slow mornings and big ideas.",
    personality: ["Curious", "Calm", "Witty"], interests: ["Design", "Coffee", "Museums"],
    photo: stock("1494790108377-be9c29b29330"), verified: true, online: true, goals: "Long-term",
  },
  {
    id: "p2", name: "Marcus", age: 29, gender: "Male", distanceMi: 4,
    profession: "Product Designer", bio: "Surf at dawn, ship by noon.",
    personality: ["Driven", "Warm", "Playful"], interests: ["Surf", "Vinyl", "Ramen"],
    photo: stock("1500648767791-00dcc994a43e"), verified: true, online: false, goals: "Casual",
  },
  {
    id: "p3", name: "Aisha", age: 27, gender: "Female", distanceMi: 6,
    profession: "Doctor", bio: "Books, basil plants, and bad puns.",
    personality: ["Kind", "Sharp", "Grounded"], interests: ["Reading", "Yoga", "Cooking"],
    photo: stock("1438761681033-6461ffad8d80"), verified: false, online: true, goals: "Long-term",
  },
  {
    id: "p4", name: "Diego", age: 31, gender: "Male", distanceMi: 8,
    profession: "Photographer", bio: "Chasing the right light.",
    personality: ["Creative", "Quiet", "Loyal"], interests: ["Film", "Hiking", "Coffee"],
    photo: stock("1507003211169-0a1dd7228f2d"), verified: true, online: true, goals: "Friendship",
  },
];

export type MatchEntry = {
  id: string;
  name: string;
  age: number;
  photo: string;
  lastMessage?: string;
  matchedAgo: string;
  online: boolean;
  unread: number;
};

export const matches: MatchEntry[] = [
  { id: "m1", name: "David", age: 28, photo: stock("1500648767791-00dcc994a43e", 200, 200), matchedAgo: "2 hours ago", online: true, unread: 2, lastMessage: "Hey! How's your week going?" },
  { id: "m2", name: "Sarah", age: 26, photo: stock("1544005313-94ddf0286df2", 200, 200), matchedAgo: "yesterday", online: false, unread: 0, lastMessage: "Hey, I noticed we both love jazz…" },
  { id: "m3", name: "Priya", age: 30, photo: stock("1487412720507-e7ab37603c6f", 200, 200), matchedAgo: "3 days ago", online: true, unread: 1, lastMessage: "That café sounds perfect." },
];

export type Message = { id: string; from: "me" | "them"; text: string; at: string };

export const conversation: Record<string, Message[]> = {
  m1: [
    { id: "1", from: "them", text: "Hey! How's your week going?", at: "10:24" },
    { id: "2", from: "me", text: "Pretty good — lots of design reviews. You?", at: "10:31" },
    { id: "3", from: "them", text: "Same here. Coffee this weekend?", at: "10:33" },
  ],
  m2: [{ id: "1", from: "them", text: "Hey, I noticed we both love jazz…", at: "Yesterday" }],
  m3: [{ id: "1", from: "them", text: "That café sounds perfect.", at: "Mon" }],
};

// Admin data
export type AdminUser = {
  id: string;
  name: string;
  email: string;
  joined: string;
  status: "active" | "suspended" | "banned";
  verified: boolean;
  plan: "Free" | "Plus" | "Premium";
};

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Elena Park", email: "elena@example.com", joined: "2026-04-12", status: "active", verified: true, plan: "Premium" },
  { id: "u2", name: "Marcus Lee", email: "marcus@example.com", joined: "2026-03-02", status: "active", verified: true, plan: "Plus" },
  { id: "u3", name: "Aisha Khan", email: "aisha@example.com", joined: "2026-05-19", status: "active", verified: false, plan: "Free" },
  { id: "u4", name: "Diego Romero", email: "diego@example.com", joined: "2026-02-21", status: "suspended", verified: true, plan: "Plus" },
  { id: "u5", name: "Noah Patel", email: "noah@example.com", joined: "2026-05-04", status: "banned", verified: false, plan: "Free" },
];

export type Report = {
  id: string; reportedUser: string; reportedBy: string; reason: string; status: "open" | "reviewing" | "closed"; createdAt: string;
};
export const reports: Report[] = [
  { id: "r1", reportedUser: "Noah Patel", reportedBy: "Elena Park", reason: "Harassment in messages", status: "reviewing", createdAt: "2026-05-25" },
  { id: "r2", reportedUser: "Diego Romero", reportedBy: "Aisha Khan", reason: "Suspicious behavior", status: "open", createdAt: "2026-05-27" },
  { id: "r3", reportedUser: "Unknown 19", reportedBy: "Marcus Lee", reason: "Fake profile photos", status: "closed", createdAt: "2026-05-10" },
];

export type Ticket = { id: string; subject: string; user: string; status: "open" | "pending" | "resolved"; created: string };
export const tickets: Ticket[] = [
  { id: "t1", subject: "Can't upload profile video", user: "Elena Park", status: "pending", created: "2026-05-26" },
  { id: "t2", subject: "Refund for Premium plan", user: "Marcus Lee", status: "open", created: "2026-05-27" },
  { id: "t3", subject: "Verification stuck", user: "Aisha Khan", status: "resolved", created: "2026-05-20" },
];

export type Payment = { id: string; user: string; amount: number; plan: string; status: "successful" | "pending" | "refunded"; date: string };
export const payments: Payment[] = [
  { id: "pay1", user: "Elena Park", amount: 29.99, plan: "Premium", status: "successful", date: "2026-05-25" },
  { id: "pay2", user: "Marcus Lee", amount: 9.99, plan: "Plus", status: "successful", date: "2026-05-24" },
  { id: "pay3", user: "Diego Romero", amount: 9.99, plan: "Plus", status: "refunded", date: "2026-05-22" },
  { id: "pay4", user: "Priya Shah", amount: 29.99, plan: "Premium", status: "pending", date: "2026-05-28" },
];

export const analytics = {
  totals: { users: 12480, premium: 1832, revenueMtd: 48720, reportsOpen: 14 },
  genderRatio: [
    { name: "Female", value: 5320 },
    { name: "Male", value: 6210 },
    { name: "Non-binary", value: 950 },
  ],
  geo: [
    { city: "New York", users: 2100 },
    { city: "Los Angeles", users: 1640 },
    { city: "Chicago", users: 980 },
    { city: "Austin", users: 870 },
    { city: "Seattle", users: 760 },
  ],
  revenueMonthly: [
    { m: "Jan", rev: 22000 }, { m: "Feb", rev: 26500 }, { m: "Mar", rev: 31200 },
    { m: "Apr", rev: 38900 }, { m: "May", rev: 48720 },
  ],
};
