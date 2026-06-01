"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { StatCard } from "@/features/admin/StatCard";
import { Users, DollarSign, Crown, Flag } from "lucide-react";
import { analytics, reports as mockReports, adminUsers as mockUsers } from "@/lib/mock-data";
import { getToken } from "@/lib/auth";

// Dynamically import chart to improve performance and prevent hydration errors
const RevenueChart = dynamic(() => import("@/features/admin/AdminRevenueChart"), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-slate-400">Loading chart...</div>
});

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    users: analytics.totals.users,
    premium: analytics.totals.premium,
    revenueMtd: analytics.totals.revenueMtd,
    reportsOpen: analytics.totals.reportsOpen,
  });
  
  const [recentUsers, setRecentUsers] = useState(mockUsers.slice(0, 5));
  const [recentReports, setRecentReports] = useState(mockReports.slice(0, 5));

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = getToken();
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Fetch stats
        const statsRes = await fetch(`${API}/admin/stats`, { headers });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(prev => ({
            ...prev,
            users: statsData.totalUsers || prev.users,
            premium: statsData.premiumUsers || prev.premium,
            reportsOpen: statsData.openTickets || prev.reportsOpen,
          }));
        }

        // Fetch recent users
        const usersRes = await fetch(`${API}/admin/users?limit=5`, { headers });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (usersData.users && usersData.users.length > 0) {
            const mappedUsers = usersData.users.map((u: any) => ({
              id: u.id.toString(),
              name: u.name,
              email: u.email,
              plan: u.plan === 'free' ? 'Free' : 'Premium',
              joined: new Date(u.createdAt).toISOString().split('T')[0],
              status: u.status,
            }));
            
            // Merge real users with mock users to ensure UI always looks full during demo
            const merged = [...mappedUsers, ...mockUsers];
            // Deduplicate by email
            const unique = Array.from(new Map(merged.map(item => [item.email, item])).values());
            setRecentUsers(unique.slice(0, 5));
          }
        }
        
        // Contacts/Reports
        const contactsRes = await fetch(`${API}/admin/contacts`, { headers });
        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          if (contactsData && contactsData.length > 0) {
            const mappedReports = contactsData.map((c: any) => ({
              id: c.id.toString(),
              reportedUser: c.email,
              reason: c.subject || c.message.substring(0, 20) + '...',
              status: c.status,
            }));
            const mergedReports = [...mappedReports, ...mockReports];
            setRecentReports(mergedReports.slice(0, 5));
          }
        }
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Platform health at a glance.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={stats.users.toLocaleString()} delta="+4.2% this month" tone="positive" icon={Users} />
        <StatCard label="Premium subscribers" value={stats.premium.toLocaleString()} delta="+118 this week" tone="positive" icon={Crown} />
        <StatCard label="Revenue (MTD)" value={`$${stats.revenueMtd.toLocaleString()}`} delta="+11.6% vs last month" tone="positive" icon={DollarSign} />
        <StatCard label="Open reports" value={String(stats.reportsOpen)} delta="3 awaiting action" tone="negative" icon={Flag} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white/60 backdrop-blur-md p-6 shadow-xl shadow-rose-500/5 lg:col-span-2 ring-1 ring-white/50">
          <h3 className="text-lg font-bold text-slate-900">Revenue trend</h3>
          <p className="text-xs font-medium text-slate-500">Last 5 months</p>
          <div className="mt-4 h-64">
            <RevenueChart data={analytics.revenueMonthly} />
          </div>
        </div>

        <div className="rounded-3xl bg-white/60 backdrop-blur-md p-6 shadow-xl shadow-rose-500/5 ring-1 ring-white/50">
          <h3 className="text-lg font-bold text-slate-900">Recent reports</h3>
          <ul className="mt-6 space-y-4 text-sm">
            {recentReports.map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-3 group">
                <div>
                  <p className="font-semibold text-slate-900">{r.reportedUser}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{r.reason}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white shadow-sm px-2.5 py-1 rounded-full group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">{r.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-3xl bg-white/60 backdrop-blur-md p-6 shadow-xl shadow-rose-500/5 ring-1 ring-white/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Recently joined</h3>
          <span className="text-xs font-bold text-slate-500 bg-white shadow-sm px-3 py-1.5 rounded-full">{recentUsers.length} users</span>
        </div>
        <div className="overflow-hidden rounded-2xl bg-white/50">
          <table className="w-full text-sm text-slate-600">
            <thead className="text-left text-xs font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">User</th><th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Joined</th><th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/80 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">{u.name}</span>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${u.plan === 'Premium' ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md shadow-rose-500/20' : 'bg-slate-100 text-slate-600'}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500">{u.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
